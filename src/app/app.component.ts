import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileService } from './file.service';
import { DataResponse } from './models/data-response.model';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  formGroup = this.fb.group({
    file: new FormControl(null, [Validators.required]),
  });

  imagePath: SafeResourceUrl;
  imageProccess: SafeResourceUrl;
  totalTimeOfProccess: number;
  dataResponse: DataResponse;

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private fileService: FileService
  ) {}

  ngOnInit(): void {}

  onFileChange(event) {
    const start = Date.now();
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.formGroup.patchValue({
          file: reader.result,
        });
        const localFilePath = this.formGroup.value.file;
        this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl(
          localFilePath
        );
        this.cd.markForCheck();
        this.totalTimeOfProccess = Date.now() - start;
      };
    }
  }

  serialProccess() {
    this.fileService.serialProccess(this.imagePath).subscribe(
      (resp: DataResponse) => {
        this.dataResponse = resp;
        this.imageProccess = this.dataResponse.imageBase64;
      },
      (err) => console.error(err)
    );
  }

  serailEffect(type: string) {
    switch (type) {
      case 'LIGHT_GRAY':
        this.getImageLightGray();
        break;
      default:
        console.error('invalid option');
    }
  }

  private getImageLightGray() {
    this.fileService.getImageLightGray().subscribe((resp: DataResponse) => {
      console.log(resp);
      this.dataResponse = resp;
      this.imageProccess = resp.imageBase64;
    }, (err) => console.error(err)
    );
  }

  timeToMilesseconds(date: Date) {
    return date.getMilliseconds();
  }

  nanotoMilleseconds(nano: number): number {
    return nano / 1000000;
  }

  nanoToSeconds(nano: number) {
    return nano / 1_000_000_000.0;
  }

}
