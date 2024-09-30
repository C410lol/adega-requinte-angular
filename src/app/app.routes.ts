import { Routes } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { pagesRoutes } from './pages/pages.routes';
import { LoginComponent } from './pages/login/login.component';
import { CreateComponent } from './pages/create/create.component';

export const routes: Routes = [
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'create', component: CreateComponent
    },
    {
        path: '', component: PagesComponent, loadChildren: () => pagesRoutes
    }
];
