import { Component, Input } from '@angular/core';
import { User } from '../user-interface';

@Component({
selector: 'app-avatar',
templateUrl: './avatar.component.html',
styleUrls: ['./avatar.component.css']
})
export class AvatarComponent {
	@Input() user?: User;
	popUpOn: boolean = false;
//	wait: any;

	onClick(): void {
		this.popUpOn = this.popUpOn ? false : true;
//		var self = this;
//		this.wait = setTimeout(function() {
//			self.popUpOn = false;
//		}, 1500);
	}

	onHover(): void {
		var self = this;
//		clearTimeout(this.wait);
		this.popUpOn = true;
		function repeat(){
			setTimeout(function() {
				return self.popUpOn ? repeat() : false;
			}, 300);
		}; repeat();
	}

	onHoverOut(): void {
		this.popUpOn = false;
	}
}
