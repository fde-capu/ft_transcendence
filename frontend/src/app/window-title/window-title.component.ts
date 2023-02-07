import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-window-title',
  templateUrl: './window-title.component.html',
  styleUrls: ['./window-title.component.css']
})
export class WindowTitleComponent {
	@Input() windowName?: string;
	@Input() windowExtras?: string;
	ngOnInit() {}
}
