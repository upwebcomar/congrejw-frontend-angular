import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  urlToBlob(response: Blob) {
    const blob = URL.createObjectURL(response);
    return blob;
  }
}
