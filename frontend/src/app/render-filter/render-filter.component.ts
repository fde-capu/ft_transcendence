import { Component } from '@angular/core';

@Component({
  selector: 'app-render-filter',
  templateUrl: './render-filter.component.html',
  styleUrls: ['./render-filter.component.css']
})
export class RenderFilterComponent {
	ngOnInit() {

		const efx_glitch_frequency = 42; // seconds
		const efx_glitch_duration = 1 // seconds
		const efx_glitch_speed = 0.1 // 0-1
		const efx_glitch_intensity = 0.1 // 0.1
		const noise_stream_max=50; // number of frames
		const noise_deform =30; // factor
		const noise_step: number =1000/60;  // ms, duration of shock frame

		function getran(min: number, max: number,round = ""): number {
			if(typeof min == "undefined")min=0;
			if(typeof max == "undefined")max=1;
			let gr = ((Math.random()*(max-min))+min);
			gr=Math.round(gr*100)/100;
			if(round=="int"){gr=Math.round(gr);}
			return gr;
		}

		const noise=document.getElementById('noise_turbulence');
		const noise_source=document.getElementById('noise_source');
		makeglitch();
		function makeglitch(){
			setTimeout(function(){
					makeglitch();
					},getran(efx_glitch_frequency*1000/2,efx_glitch_frequency*1000*1.5));
			const glitch_num_of_frames: number =(60*efx_glitch_speed*efx_glitch_duration);
			const efx_glitch_speed_nonzero: number =efx_glitch_speed?efx_glitch_speed:0.01;
			const glitch_frame_len: number =efx_glitch_duration/getran(1,efx_glitch_duration*60*efx_glitch_speed_nonzero);
			const noise_len: number =getran(0,noise_stream_max,"int");
			for (var i = 0; i < noise_len; i++) {
				setTimeout(function(){
						noise && noise.setAttribute('baseFrequency', getran(0,0.01)+" "+getran(0,0.2));
						noise && noise.setAttribute('seed', getran(0,1000).toString());
						noise_source && noise_source.setAttribute('scale', getran(0,noise_deform).toString());
						noise && noise.setAttribute("style", "display: none;");
						noise && noise.setAttribute("style", "display: unset;");
						},noise_step*i);
			}
			setTimeout(function(){
					noise && noise.setAttribute('baseFrequency', "0 0");
					noise && noise.setAttribute("style", "display: none;");
					noise && noise.setAttribute("style", "display: unset;");
					},noise_step*i+20);
			return true;
		}

	}
}
