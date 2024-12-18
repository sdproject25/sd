import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-imput-mask',
  standalone: true,
  imports: [CommonModule, FormsModule],  // CommonModule und FormsModule für ngModel
  templateUrl: './imput-mask.component.html',
  styleUrls: ['../styles.css']
})
export class ImputMaskComponent {
  // Eingabefelder für Benutzer
  newUserName: string = '';
  newUserRole: string = '';
  newRoleName: string = '';
  newRoleColor: string = '#000000';  // Standardfarbe für neue Rollen

  // Liste der Benutzer
  users: any[] = [];

  // Liste der Rollen
  roles: any[] = [
    { name: 'Mitglied', color: '#007bff' },
    { name: 'Admin', color: '#28a745' },
    { name: 'Gast', color: '#6c757d' }
  ];

  // Rolle für alle Benutzer
  allUsersRole: string = 'Mitglied';

  // Benutzer hinzufügen
  addUser() {
    if (this.newUserName && this.newUserRole) {
      const role = this.roles.find(r => r.name === this.newUserRole);
      this.users.push({
        name: this.newUserName,
        role: this.newUserRole,
        color: role ? role.color : '#6c757d' // Standardfarbe
      });
      this.newUserName = '';
      this.newUserRole = '';
    }
  }

  // Alle Benutzer löschen
  deleteAllUsers() {
    this.users = [];
  }

  // Rolle für alle Benutzer setzen
  setAllUsersRole() {
    if (this.allUsersRole) {
      this.users.forEach(user => user.role = this.allUsersRole);
    }
  }

  // Eigene Rolle erstellen
  addRole() {
    if (this.newRoleName && this.newRoleColor) {
      this.roles.push({
        name: this.newRoleName,
        color: this.newRoleColor
      });
      this.newRoleName = '';
      this.newRoleColor = '#000000';  // Zurücksetzen der Farbe
    }
  }

  // Hilfsmethode, um die Farbe basierend auf der Rolle zu bekommen
  getRoleColor(role: string): string {
    const foundRole = this.roles.find(r => r.name === role);
    return foundRole ? foundRole.color : '#6c757d'; // Standardfarbe für unbekannte Rollen
  }

  // Benutzer löschen (Aufruf im HTML, z.B. beim Klicken auf den Löschen-Button)
  deleteUser(index: number) {
    this.users.splice(index, 1);  // Entfernt den Benutzer aus der Liste
  }
}

