import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Inject, 
  OnModuleInit, 
  UseGuards, 
  Request, 
  Query, 
  Param, 
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthGuard } from './auth.guard'; // Assure-toi que le fichier est au même niveau
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
    @Inject('CATALOG_SERVICE') private readonly catalogClient: ClientKafka,
    @Inject('ORDERS_SERVICE') private readonly ordersClient: ClientKafka, 
    @Inject('INVENTORY_SERVICE') private readonly inventoryClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // --- 1. Abonnements aux réponses (Indispensable pour Kafka) ---
    
    // Auth
    this.authClient.subscribeToResponseOf('create_user');
    this.authClient.subscribeToResponseOf('login_user');
    
    // Catalog
    this.catalogClient.subscribeToResponseOf('create_product');
    this.catalogClient.subscribeToResponseOf('get_products');
    this.catalogClient.subscribeToResponseOf('get_product_by_id'); // Pour la commande sécurisée
    this.catalogClient.subscribeToResponseOf('update_product');    // Pour l'Admin

    // Orders
    this.ordersClient.subscribeToResponseOf('create_order');
    this.ordersClient.subscribeToResponseOf('get_orders');

    // Inventory
    this.inventoryClient.subscribeToResponseOf('create_inventory');
    this.inventoryClient.subscribeToResponseOf('get_inventory');
    this.inventoryClient.subscribeToResponseOf('restock_inventory'); // Pour l'Admin

    // --- 2. Connexion aux Microservices ---
    await this.authClient.connect();
    await this.catalogClient.connect();
    await this.ordersClient.connect();
    await this.inventoryClient.connect();
  }

  // ============================
  // AUTHENTIFICATION
  // ============================

  @Post('register')
  createUser(@Body() body: any) {
    return this.authClient.send('create_user', body);
  }

  @Post('login')
  loginUser(@Body() body: any) {
    return this.authClient.send('login_user', body);
  }

  // ============================
  // CATALOGUE (Public)
  // ============================

  // Liste des produits (Avec Pagination et Filtres)
  @Get('products')
  getProducts(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('category') category: string,
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
  ) {
    return this.catalogClient.send('get_products', {
      page,
      limit,
      category,
      minPrice,
      maxPrice,
    });
  }

  // Détail d'un produit
  @Get('products/:id')
  getProductById(@Param('id') id: string) {
    return this.catalogClient.send('get_product_by_id', { id: parseInt(id) });
  }

  // ============================
  // ADMINISTRATION (Admin Only)
  // ============================

  @UseGuards(AuthGuard)
  @Post('products') // Création produit (Admin ou Vendeur selon tes règles)
  createProduct(@Body() body: any) {
    return this.catalogClient.send('create_product', body);
  }

  // Mise à jour produit
  @UseGuards(AuthGuard)
  @Post('admin/products/:id')
  async updateProduct(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    if (req.user.role !== 'ADMIN') {
      throw new HttpException('Accès interdit : Réservé aux Admins', HttpStatus.FORBIDDEN);
    }

    return this.catalogClient.send('update_product', {
      id: parseInt(id),
      ...body
    });
  }

  // Réapprovisionnement Stock
  @UseGuards(AuthGuard)
  @Post('admin/restock')
  async restockInventory(@Body() body: any, @Request() req: any) {
    if (req.user.role !== 'ADMIN') {
      throw new HttpException('Accès interdit : Réservé aux Admins', HttpStatus.FORBIDDEN);
    }

    return this.inventoryClient.send('restock_inventory', {
      sku: body.sku,
      quantity: body.quantity
    });
  }

  // ============================
  // COMMANDES (Client)
  // ============================

  @UseGuards(AuthGuard)
  @Post('orders')
  async createOrder(@Body() body: any, @Request() req: any) {
    const { productId, quantity } = body;
    const userId = req.user.sub;

    console.log(`🛒 Traitement commande : User ${userId}, Produit ${productId}, Qté ${quantity}`);

    try {
      // 1. Appel Synchrone au Catalogue pour vérifier le produit et le prix
      const product = await firstValueFrom(
        this.catalogClient.send('get_product_by_id', { id: productId })
      );

      if (!product) {
        throw new HttpException('Produit introuvable', HttpStatus.NOT_FOUND);
      }

      // Vérification simple du stock affiché au catalogue (optionnel, l'inventaire fera le vrai check)
      if (product.stock < quantity) {
         throw new HttpException('Stock insuffisant', HttpStatus.BAD_REQUEST);
      }

      // 2. Calcul du Total Sécurisé (Prix officiel * Quantité)
      const total = product.price * quantity;
      console.log(`💰 Prix vérifié : ${product.price} x ${quantity} = ${total}`);

      // 3. Envoi au service Orders
      return this.ordersClient.send('create_order', {
        userId,
        productId,
        quantity,
        total, // Le prix est imposé par le serveur
      });

    } catch (error) {
      throw new HttpException(error.message || 'Erreur lors de la commande', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Get('orders')
  getOrders(@Request() req: any) {
    // Filtre les commandes par l'ID de l'utilisateur connecté
    return this.ordersClient.send('get_orders', { userId: req.user.sub });
  }

  // ============================
  // INVENTAIRE (Public/Debug)
  // ============================

  @UseGuards(AuthGuard)
  @Post('inventory')
  addInventory(@Body() body: any) {
    return this.inventoryClient.send('create_inventory', body);
  }

  @Get('inventory')
  getInventory() {
    return this.inventoryClient.send('get_inventory', {});
  }
}