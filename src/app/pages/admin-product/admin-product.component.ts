import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GrapesService } from '../../services/grapes.service';
import { DropdownComponent } from "../../components/dropdown/dropdown.component";
import { WinesService } from '../../services/wines.service';
import { ProductDTO } from '../../dtos/ProductDTO';
import { DialogService } from '../../services/dialog.service';
import { AppMessages } from '../../constants/Messages';
import { LoadStatus } from '../../constants/LoadStatusEnum';
import { BackComponent } from '../../components/back/back.component';
import { ErrorComponent } from "../../components/error/error.component";

@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, DropdownComponent, BackComponent, ErrorComponent],
  providers: [GrapesService, WinesService],
  templateUrl: './admin-product.component.html',
  styleUrl: './admin-product.component.css'
})
export class AdminProductComponent implements OnInit {

  loadStatus: LoadStatus = LoadStatus.LOADING;

  productId: string = '';
  ifProductExists: boolean = false;

  selectedImages: string[] = [];

  isGrapesDropDownShown: boolean = false;
  allGrapes: { name: string, value: string }[] = [];

  name: string = '';
  description: string = '';
  type: string = 'Tinto';
  country: string = 'Brasil';
  classification: string = 'Nature';
  size: string = '';
  quantity: number = 0;
  grape: string = '';
  hasProm: string = 'false';
  promPrice: string = '';
  price: string = '';
  status: string = 'DISPONÍVEL';

  selectedGrapes: { name: string, value: string }[] = [];




  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private grapesService: GrapesService,
    private winesService: WinesService,
    private dialogService: DialogService,
  ) { }




  ngOnInit(): void {
    this.getProductId();
  }




  getProductId(): void {
    this.activatedRoute.params.subscribe({
      next: (res) => {

        const productIdParam = res['productId'];
        if (productIdParam == null) { 
          this.loadStatus = LoadStatus.LOADED;
          return;
        }

        this.productId = productIdParam;
        this.ifProductExists = true;
        this.getProduct();

      }
    });
  }




  getProduct(): void {
    this.winesService.getWineById(this.productId).subscribe({
      next: (res) => {

        if (!res.ok || res.body == null) {
          this.loadStatus = LoadStatus.ERROR;
          return;
        }

        this.name = res.body.name;
        this.description = res.body.description;
        this.type = res.body.type;
        this.country = res.body.country;
        this.classification = res.body.classification;
        this.size = res.body.size;
        this.quantity = res.body.quantity;
        this.price = res.body.regPrice.toString();
        this.hasProm = res.body.hasProm.toString();
        this.promPrice = res.body.promPrice.toString();
        this.status = res.body.status;

        this.selectedGrapes = res.body.grapes.map((e) => ({ name: e.name, value: e.id }));

        this.loadStatus = LoadStatus.LOADED;

      },
      error: (err) => {

        console.error(err);
        this.dialogService.openDialogError(err.error.message);

      }
    });
  }

  findGrapesByName(): void {
   this.grapesService.findAllByName(this.grape).subscribe({
    next: (res) => {

      if (!res.ok || res.body == null) return;

      this.allGrapes = res.body.value.map((e) => ({ name: e.name, value: e.id }));

    }
   });
  }

  saveProduct(): void {
    this.winesService.save(this.createProductDTO()).subscribe({
      next: (res) => {

        if (!res.ok) {
          this.dialogService.openDialogError('Algo deu errado, tente novamente mais tarde');
          return;
        }

        this.dialogService.openDialogSuccess('Produto criado com sucesso!');
        this.router.navigate([`${this.router.url}/${res.body?.value.id}`]);

      },
      error: (err) => {

        console.error(err);
        this.dialogService.openDialogError(err.error.message);

      }
    });
  }

  editProduct(): void {
    this.winesService.edit(this.productId, this.createProductDTO()).subscribe({
      next: (res) => {

        if (!res.ok) {
          this.dialogService.openDialogError('Algo deu errado, tente novamente mais tarde');
          return;
        }

        this.dialogService.openDialogSuccess('Produto editado com sucesso!');
        setTimeout(() => {
          location.reload();
        }, 1000);

      },
      error: (err) => {

        console.error(err);
        this.dialogService.openDialogError(err.error.message);

      }
    });
  }

  deleteProduct(): void {
    this.winesService.delete(this.productId).subscribe({
      next: (res) => {

        if (!res.ok) {
          this.dialogService.openDialogError('Algo deu errado, tente novamente mais tarde');
          return;
        }

        this.dialogService.openDialogSuccess('Produto deletado com sucesso!');
        this.router.navigate(['/admin-products']);

      },
      error: (err) => {

        console.error(err);
        this.dialogService.openDialogError(err.error.message);

      }
    })
  }




  selectImage(event: any): void {
    console.log(this.selectedImages);
    const files: FileList = event.target.files;

    console.log(files);

    if (files.length < 1) return;

    Array.from(files).forEach((e) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImages.push(e.target.result);
      }
      reader.readAsDataURL(e);
    });
  }

  deleteSelectedImage(img: string): void {
    this.selectedImages.splice(this.selectedImages.indexOf(img), 1);
  }




  createSelectedGrape(): void {
    this.selectedGrapes.forEach((e) => {
      if (e.name == this.grape) throw new Error;
    });

    if (this.grape.trim().length < 1) return;

    this.selectedGrapes.push({ name: this.grape, value: '' });
  }

  addSelectedGrape(item: { name: string, value: string }): void {
    if (this.selectedGrapes.indexOf(item) == -1) this.selectedGrapes.push(item);
  }

  removeSelectedGrape(item: { name: string, value: string }): void {
    this.selectedGrapes.splice(this.selectedGrapes.indexOf(item), 1);
  }

  


  priceInputCheck(): void {
    const noPoint = this.price.replace(/\D/g, '');

    if (noPoint.length == 0) this.price = '';

    if (noPoint.length <= 2 && noPoint.length > 0) this.price = '.' + noPoint;

    if (noPoint.length > 2) {
      const x = noPoint.slice(noPoint.length - 2);
      const y = noPoint.slice(0, noPoint.length - 2) + '.';

      this.price = y + x;
    }
  }

  promPriceInputCheck(): void {
    const noPoint = this.promPrice.replace(/\D/g, '');

    if (noPoint.length == 0) this.promPrice = '';

    if (noPoint.length <= 2 && noPoint.length > 0) this.promPrice = '.' + noPoint;

    if (noPoint.length > 2) {
      const x = noPoint.slice(noPoint.length - 2);
      const y = noPoint.slice(0, noPoint.length - 2) + '.';

      this.promPrice = y + x;
    }
  }




  isInputFieldsOk(): boolean {
    if (
      this.name.trim().length < 1 ||
      this.description.trim().length < 1 ||
      this.price.trim().length < 1 ||
      isNaN(Number.parseFloat(this.price))
    ) return false;

    if (this.hasProm == 'true') {
      if (
        this.promPrice.trim().length < 1 || 
        isNaN(Number.parseFloat(this.promPrice))
      ) return false;
    }

    return true;
  }

  createProductDTO(): ProductDTO {
    let productDTO = {} as ProductDTO;
    productDTO.name = this.name;
    productDTO.description = this.description,
    productDTO.type = this.type;
    productDTO.country = this.country;
    productDTO.classification = this.classification;
    productDTO.size = this.size;
    productDTO.quantity = this.quantity;
    productDTO.regPrice = Number.parseFloat(this.price);
    productDTO.hasProm = this.hasProm == 'true';
    productDTO.promPrice = Number.parseFloat(this.promPrice);
    productDTO.status = this.status;
    productDTO.grapes = this.selectedGrapes.map((e) => ({ id: e.value, name: e.name }));

    return productDTO;
  }




  saveBtnClick(): void {
    if (!this.isInputFieldsOk()) {
      this.dialogService.openDialogError(AppMessages.fieldError);
      return;
    }

    if (!this.ifProductExists) {
      this.saveProduct();
      return;
    } else this.editProduct();
  }




  deleteActionDialog(): void {
    this.dialogService.openActionDialog('Deletar Produto?').subscribe({
      next: (res) => {

        if (res == 'confirm') this.deleteProduct();

      }
    })
  }




  timeoutDropDown(): void {
    setTimeout(() => {
      this.isGrapesDropDownShown = false;
    }, 100);
  }

}
