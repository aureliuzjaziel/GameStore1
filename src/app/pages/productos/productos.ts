import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos {
  // Search and filter properties
  searchTerm: string = '';
  sortBy: string = 'name';
  selectedCategory: string = 'all';
  
  // User role (this would come from auth service)
  isAdmin: boolean = true; // Change this based on actual user role
  
  // Methods for filtering and searching
  filterByCategory(category: string): void {
    this.selectedCategory = category;
    console.log('Filtering by category:', category);
    // Here you would implement the actual filtering logic
  }
  
  // Mock data - this would come from a service
  games = [
    {
      id: 1,
      title: 'Epic Adventure Chronicles',
      category: 'rpg',
      price: 59.99,
      discountPrice: 41.99,
      rating: 4.8,
      image: '🏆'
    },
    // Add more games as needed
  ];
}
