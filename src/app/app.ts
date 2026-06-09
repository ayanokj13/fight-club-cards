import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface BattleCard {
  id: number;
  name: string;
  frontImage: string;
  backImage: string;
  rotationX: number;
  rotationY: number;
  isDragging: boolean; 
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'Saloni Fight Club Gallery';

  cards: BattleCard[] = [
    {
      id: 1,
      name: 'Adharsh Pagui',
      frontImage: 'adharsh-front.png',
      backImage: 'card-back.png',
      rotationX: 0,
      rotationY: 0,
      isDragging: false 
    },
    // Add the other 11 friends here...
  ];

  activeCard: BattleCard | null = null;
  startX = 0;
  startY = 0;
  initialRotationX = 0;
  initialRotationY = 0;
  hasMoved = false; // TRACKER: Distinguishes a tap from a drag

  startDrag(event: MouseEvent | TouchEvent, card: BattleCard) {
    this.activeCard = card;
    card.isDragging = true; 
    this.hasMoved = false; // Reset the movement tracker on click
    
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    this.startX = clientX;
    this.startY = clientY;
    this.initialRotationX = card.rotationX;
    this.initialRotationY = card.rotationY;
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  onDrag(event: MouseEvent | TouchEvent) {
    if (!this.activeCard) return;

    const clientX = 'touches' in event ? event.touches[0].clientX : (event as MouseEvent).clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : (event as MouseEvent).clientY;

    const deltaX = clientX - this.startX;
    const deltaY = clientY - this.startY;

    // IF moved more than 5 pixels, it is a drag, not a simple tap
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      this.hasMoved = true;
    }

    this.activeCard.rotationY = this.initialRotationY + deltaX * 0.5;
    this.activeCard.rotationX = this.initialRotationX - deltaY * 0.5;
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  stopDrag() {
    if (this.activeCard) {
      this.activeCard.isDragging = false; 
      
      // Always level the card vertically
      this.activeCard.rotationX = 0;
      
      if (!this.hasMoved) {
        // TAP DETECTED: Force a clean 180-degree flip from where it started
        this.activeCard.rotationY = this.initialRotationY + 180;
      } else {
        // DRAG DETECTED: Smart Snap to the nearest face
        const nearest180 = Math.round(this.activeCard.rotationY / 180) * 180;
        this.activeCard.rotationY = nearest180;
      }
      
      this.activeCard = null;
    }
  }
}