import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

import { DefaultService } from './apimodule/api/default.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'xknxui';
  api_url = environment.api_url;
  
  public project: any;
    
  constructor(private defaultService: DefaultService) {}
    
  ngOnInit(): void {
    this.defaultService.getApiProjectApiProjectGet()
        .subscribe(
            (project: any) => {
                this.project = project
            }
        )
    }
}
