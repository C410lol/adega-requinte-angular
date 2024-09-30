import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WineComponent } from './wine/wine.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ConfirmedOrderComponent } from './confirmed-order/confirmed-order.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderComponent } from './order/order.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { AdminProductComponent } from './admin-product/admin-product.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { AdminOrderComponent } from './admin-order/admin-order.component';

export const pagesRoutes: Routes = [
    {
        path: '', component: HomeComponent
    },
    {
        path: 'cart', component: CartComponent
    },
    {
        path: 'checkout', component: CheckoutComponent
    },
    {
        path: 'confirmed-order', component: ConfirmedOrderComponent
    },
    {
        path: 'orders', children: [
            {
                path: '', component: OrdersComponent
            },
            {
                path: ':orderId', component: OrderComponent
            }
        ]
    },
    




    {
        path: 'admin-products', children: [

            { 
                path: '', component: AdminProductsComponent 
            },

            { 
                path: 'product', children: [

                    {
                        path: '', component: AdminProductComponent
                    },

                    {
                        path: ':productId', component: AdminProductComponent
                    }

                ]
            }

        ]
    },




    {
        path: 'admin-orders', children: [

            { 
                path: '', component: AdminOrdersComponent 
            },

            { 
                path: 'order', children: [

                    {
                        path: ':orderId', component: AdminOrderComponent
                    }

                ]
            }

        ]
    },




    {
        path: ':productId', component: WineComponent
    },
];