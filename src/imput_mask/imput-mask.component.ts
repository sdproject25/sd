import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../app/services/user.service';

@Component({
  selector: 'app-imput-mask',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './imput-mask.component.html',
  styleUrls: ['../styles.css']
})
export class ImputMaskComponent {
  newUserName: string = '';
  newUserRoles: string[] = [];
  newRoleName: string = '';
  newRoleColor: string = '#000000';
  users: { name: string; roles: string[] }[] = [];
  roles: { name: string; color: string }[] = [];

  constructor(private router: Router, private userService: UserService) {
    this.loadUsersAndRoles();
  }

  // Lädt Benutzer und Rollen aus dem Service
  loadUsersAndRoles() {
    this.users = this.userService.getUsers();
    this.roles = this.userService.getRoles();
  }

  // Benutzer hinzufügen
  addUser() {
    if (this.newUserName.trim() !== '' && this.newUserRoles.length > 0) {
      this.users.push({
        name: this.newUserName.trim(),
        roles: [...this.newUserRoles]
      });
      this.userService.setUsers(this.users);
      this.newUserName = '';
      this.newUserRoles = [];
    }
  }

  // Rolle hinzufügen
  addRole() {
    if (this.newRoleName.trim() !== '' && this.newRoleColor) {
      this.roles.push({
        name: this.newRoleName.trim(),
        color: this.newRoleColor
      });
      this.userService.setRoles(this.roles);
      this.newRoleName = '';
      this.newRoleColor = '#000000';
    }
  }

  // Benutzer zu einer Rolle hinzufügen oder entfernen
  toggleUserRole(role: string, event: any) {
    if (event.target.checked) {
      this.newUserRoles.push(role);
    } else {
      this.newUserRoles = this.newUserRoles.filter(r => r !== role);
    }
  }

  // Rolle löschen
  deleteRole(index: number) {
    const roleToDelete = this.roles[index].name;
    this.roles.splice(index, 1);
    this.users.forEach(user => {
      user.roles = user.roles.filter(role => role !== roleToDelete);
    });
    this.newUserRoles = this.newUserRoles.filter(role => role !== roleToDelete);
    this.userService.setRoles(this.roles);
  }

  // Benutzer löschen
  deleteUser(index: number) {
    this.users.splice(index, 1);
    this.userService.setUsers(this.users);
  }

  // Alle Benutzer löschen
  deleteAllUsers() {
    this.users = [];
    this.userService.setUsers(this.users);
  }

  // Farbe einer Rolle abrufen
  getRoleColor(role: string): string {
    const foundRole = this.roles.find(r => r.name === role);
    return foundRole ? foundRole.color : '#000000';
  }

  // Zur Startseite navigieren
  goToNextPage() {
    this.userService.setUsers([...this.users]);
    this.router.navigate(['/startpage-admin']);
  }
  
}
















