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
import { HarmonizationsService } from '../../services/harmonizations.service';

@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, DropdownComponent, BackComponent, ErrorComponent],
  providers: [GrapesService, HarmonizationsService, WinesService],
  templateUrl: './admin-product.component.html',
  styleUrl: './admin-product.component.css'
})
export class AdminProductComponent implements OnInit {

  loadStatus: LoadStatus = LoadStatus.LOADING;

  productId: string = '';
  ifProductExists: boolean = false;

  selectedImages: { url: string, file: File }[] = [];

  name: string = '';
  description: string = '';
  type: string = 'Vinho';
  category: string = 'Tinto';
  country: string = 'Brasil';
  classification: string = 'Nature';
  size: string = '';
  quantity: number = 0;
  hasProm: string = 'false';
  promPrice: string = '';
  price: string = '';
  status: string = 'DISPONÍVEL';
  images: string[] = [];

  harmo: string = '';
  isHarmoDropdownShown: boolean = false;
  allHarmo: { name: string, value: string }[] = [];
  selectedHarmos: { name: string, value: string }[] = [];

  grape: string = '';
  isGrapesDropDownShown: boolean = false;
  allGrapes: { name: string, value: string }[] = [];
  selectedGrapes: { name: string, value: string }[] = [];



  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private harmosService: HarmonizationsService,
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
    this.loadStatus = LoadStatus.LOADING;
    this.winesService.getWineById(this.productId).subscribe({
      next: (res) => {

        if (!res.ok || res.body == null) {
          this.loadStatus = LoadStatus.ERROR;
          return;
        }

        const body = res.body;

        this.name = body.name;
        this.description = body.description;
        this.type = body.type;
        this.quantity = body.quantity;
        this.price = body.regPrice.toString();
        this.hasProm = body.hasProm.toString();
        this.status = body.status;

        if (body.category != null) this.category = body.category.replaceAll(' ', '_');
        if (body.country != null) this.country = body.country.id;
        if (body.classification != null) this.classification = body.classification.replaceAll(' ', '_');

        if (body.size != null) this.size = body.size;

        if (body.promPrice != null) this.promPrice = body.promPrice.toString();

        if (body.images != null) this.images = body.images;

        if (body.harmonizationTags != null) {
          this.selectedHarmos = body.harmonizationTags.map((e) => ({name: e.name, value: e.id}));
        }

        if (body.grapes != null) {
          this.selectedGrapes = body.grapes.map((e) => ({ name: e.name, value: e.id }));
        }

        this.loadStatus = LoadStatus.LOADED;

      },
      error: (err) => {

        console.error(err);
        this.dialogService.openDialogError(err.error.message);

      }
    });
  }

  findHarmonizationsByName(): void {
    this.harmosService.findAllByName(this.harmo).subscribe({
      next: (res) => {

        if (!res.ok || res.body == null) return;

        this.allHarmo = res.body.value.map((e) => ({ name: e.name, value: e.id }));

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
    const loadingDialog = this.dialogService.openLoadingDialog();

    this.winesService.save(this.createProductDTO()).subscribe({
      next: (res) => {

        loadingDialog.close();

        if (!res.ok) {
          this.dialogService.openDialogError('Algo deu errado, tente novamente mais tarde');
          return;
        }

        this.dialogService.openDialogSuccess('Produto criado com sucesso!');
        this.router.navigate([`${this.router.url}/${res.body?.value.id}`]);

      },
      error: (err) => {

        loadingDialog.close();

        console.error(err);
        this.dialogService.openDialogError(err.error.message);

      }
    });
  }

  editProduct(): void {
    const loadingDialog = this.dialogService.openLoadingDialog();

    this.winesService.edit(this.productId, this.createProductDTO()).subscribe({
      next: (res) => {

        loadingDialog.close();

        if (!res.ok) {
          this.dialogService.openDialogError('Algo deu errado, tente novamente mais tarde');
          return;
        }

        this.dialogService.openDialogSuccess('Produto editado com sucesso!');
        this.selectedImages = [];
        this.getProduct();

      },
      error: (err) => {

        loadingDialog.close();

        console.error(err);
        this.dialogService.openDialogError(err.error.message);

      }
    });
  }

  deleteProduct(): void {
    const loadingDialog = this.dialogService.openLoadingDialog();

    this.winesService.delete(this.productId).subscribe({
      next: (res) => {

        loadingDialog.close();

        if (!res.ok) {
          this.dialogService.openDialogError('Algo deu errado, tente novamente mais tarde');
          return;
        }

        this.dialogService.openDialogSuccess('Produto deletado com sucesso!');
        this.router.navigate(['/admin-products']);

      },
      error: (err) => {

        loadingDialog.close();

        console.error(err);
        this.dialogService.openDialogError(err.error.message);

      }
    })
  }




  selectImage(event: any): void {
    const files: File[] = Array.from(event.target.files);

    if (files.length < 1) return;

    files.forEach((e) => {
      let selectedImage = {} as {url: string, file: File}; 
      selectedImage.file = e;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        selectedImage.url = e.target.result;
        this.selectedImages.push(selectedImage);
      }
      reader.readAsDataURL(e);
    });
  }

  deleteSelectedImage(url: string): void {
    if (url.startsWith('https')) {
      this.images.splice(this.images.indexOf(url), 1);
    } else this.selectedImages.splice(this.selectedImages.findIndex((e) => e.url == url), 1);
  }

  getImagesList(): string[] {
    return this.images.concat(this.selectedImages.map((e) => e.url));
  }




  createSelectedElement(
    array: {name: string, value: string}[], 
    input: string
  ): void {
    array.forEach((e) => {
      if (e.name == input) throw new Error;
    });

    if (input.trim().length < 1) return;

    array.push({name: input, value: ''});
  }

  addSelectedElement(
    array: {name: string, value: string}[], 
    element: {name: string, value: string}
  ): void {
    if (array.indexOf(element) == -1) array.push(element);
  }

  removeSelectedElement(
    array: {name: string, value: string}[], 
    element: {name: string, value: string}
  ): void {
    array.splice(array.indexOf(element), 1);
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

  createProductDTO(): FormData {
    const form = new FormData();

    this.selectedImages.forEach((e) => {
      form.append('images', e.file);
    });

    let productDTO = {} as ProductDTO;
    productDTO.name = this.name;
    productDTO.description = this.description,
    productDTO.type = this.type;
    productDTO.quantity = this.quantity;
    productDTO.regPrice = Number.parseFloat(this.price);
    productDTO.hasProm = this.hasProm == 'true';
    productDTO.status = this.status;

    if (this.type == 'Vinho' || this.type == 'Suco') {
      productDTO.size = this.size;
      productDTO.countryId = this.country;
      productDTO.harmonizations = this.selectedHarmos.map((e) => ({id: e.value, name: e.name}));
      productDTO.grapes = this.selectedGrapes.map((e) => ({ id: e.value, name: e.name }));

      if (this.type == 'Vinho') {
        productDTO.category = this.category;
        productDTO.classification = this.classification;
      }
    }
    
    if (this.hasProm == 'true') productDTO.promPrice = Number.parseFloat(this.promPrice);
    
    if (this.ifProductExists) productDTO.images = this.images;

    form.append('product', JSON.stringify(productDTO));

    return form;
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




  harmosTimeoutDropDown(): void {
    setTimeout(() => {
      this.isHarmoDropdownShown = false;
    }, 100)
  }

  grapesTimeoutDropDown(): void {
    setTimeout(() => {
      this.isGrapesDropDownShown = false;
    }, 100);
  }

}
