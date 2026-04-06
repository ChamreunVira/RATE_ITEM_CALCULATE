import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalculateComponent } from "./features/calculate/calculate.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CalculateComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('calculate');
}
