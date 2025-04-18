import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { YoutubeWidget } from "../core/interfaces/Model/YoutubeWidget";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class YoutubeWidgetService {

    
  private apiUrl = `${environment.apiUrl}/YoutubeWidgets`;

  constructor(private http: HttpClient) {}

  getWidgets() {
    return this.http.get<YoutubeWidget[]>(this.apiUrl);
  }

  getWidgetsByTipo(tipo: string) {
    return this.http.get<YoutubeWidget[]>(`${this.apiUrl}/tipo/${tipo}`);
  }

  getWidgetById(id: number) {
    return this.http.get<YoutubeWidget>(`${this.apiUrl}/${id}`);
  }
  

  create(widget: YoutubeWidget) {
    return this.http.post<YoutubeWidget>(this.apiUrl, widget);
  }

  update(widget: YoutubeWidget) {
    return this.http.put<YoutubeWidget>(`${this.apiUrl}/${widget.id}`, widget);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
