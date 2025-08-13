import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // ✅ Needed for router-outlet

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule], // ✅ Import RouterModule
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'my-app';
}
