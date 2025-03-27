import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../app/services/user.service';

@Component({
  selector: 'app-startpage-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './startpage-admin.component.html',
  styleUrls: ['../styles.css']
})
export class StartpageAdminComponent implements OnInit {
  users: { name: string; roles: string[] }[] = [];
  events: { name: string; payer: string; amount: number; beneficiaries: string[] }[] = [];
  eventFormVisible = false;
  newEvent = { name: '', payer: '', amount: 0, beneficiaries: [] as string[] };
  payer = '';
  selectedPayer: { name: string; roles: string[] } | null = null;
  filteredUsers: { name: string; roles: string[] }[] = [];
  filteredBeneficiaries: { name: string; roles: string[] }[] = [];
  selectedBeneficiaries: { name: string; roles: string[] }[] = [];
  editingIndex: number | null = null;
  detailedDebts: { [debtor: string]: { [creditor: string]: number } } = {};

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsersAndEvents();
  }

  loadUsersAndEvents() {
    this.users = this.userService.getUsers();
    this.events = this.userService.getEvents();
    this.detailedDebts = this.calculateDetailedDebts();
  }

  toggleEventForm() {
    this.eventFormVisible = !this.eventFormVisible;
    if (!this.eventFormVisible) {
      this.resetEventForm();
    }
  }

  resetEventForm() {
    this.newEvent = { name: '', payer: '', amount: 0, beneficiaries: [] };
    this.payer = '';
    this.selectedPayer = null;
    this.selectedBeneficiaries = [];
    this.editingIndex = null;
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(this.payer.toLowerCase())
    );
  }

  selectPayer(user: { name: string; roles: string[] }) {
    this.newEvent.payer = user.name;
    this.selectedPayer = user;
    this.payer = user.name;
    this.filteredUsers = [];
  }

  filterBeneficiaries(event: any) {
    const inputValue = event.target.value.toLowerCase();
    this.filteredBeneficiaries = this.users.filter(user =>
      user.name.toLowerCase().includes(inputValue) &&
      !this.selectedBeneficiaries.some(b => b.name === user.name)
    );
  }

  addBeneficiary(user: { name: string; roles: string[] }) {
    this.selectedBeneficiaries.push(user);
    this.newEvent.beneficiaries.push(user.name);
    this.filteredBeneficiaries = [];
  }

  removeBeneficiary(user: { name: string; roles: string[] }) {
    this.selectedBeneficiaries = this.selectedBeneficiaries.filter(b => b.name !== user.name);
    this.newEvent.beneficiaries = this.newEvent.beneficiaries.filter(name => name !== user.name);
  }

  editEvent(index: number) {
    this.editingIndex = index;
    const eventToEdit = this.events[index];
    this.newEvent = { ...eventToEdit };
    this.payer = eventToEdit.payer;
    this.selectedPayer = this.users.find(user => user.name === eventToEdit.payer) || null;
    this.selectedBeneficiaries = this.users.filter(user => eventToEdit.beneficiaries.includes(user.name));
    this.eventFormVisible = true;
  }

  saveEvent() {
    if (this.newEvent.name && this.newEvent.payer && this.newEvent.amount > 0 && this.newEvent.beneficiaries.length > 0) {
      if (this.editingIndex !== null) {
        this.events[this.editingIndex] = { ...this.newEvent };
        this.userService.setEvents(this.events);
      } else {
        this.userService.addEvent(this.newEvent);
        this.events = this.userService.getEvents();
      }
      this.detailedDebts = this.calculateDetailedDebts();
      this.resetEventForm();
      this.eventFormVisible = false;
    }
  }

  deleteEvent(index: number) {
    this.events.splice(index, 1);
    this.userService.setEvents(this.events);
    this.detailedDebts = this.calculateDetailedDebts();
  }

  calculateDebts(): { [key: string]: number } {
    let debts: { [key: string]: number } = {};
    this.users.forEach(user => (debts[user.name] = 0));
    this.events.forEach(event => {
      const splitAmount = event.amount / event.beneficiaries.length;
      event.beneficiaries.forEach(beneficiary => {
        debts[beneficiary] -= splitAmount;
        debts[event.payer] += splitAmount;
      });
    });
    return debts;
  }

  calculateDetailedDebts(): { [debtor: string]: { [creditor: string]: number } } {
    const detailedDebts: { [debtor: string]: { [creditor: string]: number } } = {};

    this.users.forEach(user => {
      detailedDebts[user.name] = {};
      this.users.forEach(other => {
        if (user.name !== other.name) {
          detailedDebts[user.name][other.name] = 0;
        }
      });
    });

    this.events.forEach(event => {
      const splitAmount = event.amount / event.beneficiaries.length;
      event.beneficiaries.forEach(beneficiary => {
        if (beneficiary !== event.payer) {
          detailedDebts[beneficiary][event.payer] += splitAmount;
        }
      });
    });

    return detailedDebts;
  }

  getRoleColor(role: string): string {
    return this.userService.getRoleColor(role);
  }

  getPayerColor(payer: string): string {
    return this.getRoleColor(payer);
  }

  deleteUser(index: number) {
    const userToDelete = this.users[index].name;
    this.users.splice(index, 1);
    this.userService.setUsers(this.users);
    this.events.forEach(event => {
      if (event.payer === userToDelete) {
        event.payer = '';
      }
      event.beneficiaries = event.beneficiaries.filter(b => b !== userToDelete);
    });
    this.userService.setEvents(this.events);
    this.detailedDebts = this.calculateDetailedDebts();
  }
}













