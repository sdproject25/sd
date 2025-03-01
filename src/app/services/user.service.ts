import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: { name: string; roles: string[] }[] = [];
  private roles: { name: string; color: string }[] = [];
  private events: { name: string; payer: string; amount: number; beneficiaries: string[] }[] = [];

  constructor() {
    this.loadFromStorage();
  }

  // 🔵 Nutzer abrufen
  getUsers(): { name: string; roles: string[] }[] {
    return this.users;
  }

  // 🔵 Nutzer speichern
  setUsers(users: { name: string; roles: string[] }[]) {
    this.users = users;
    this.saveToStorage();
  }

  // 🟢 Rollen abrufen
  getRoles() {
    return this.roles;
  }

  // 🟢 Rollen speichern
  setRoles(roles: { name: string; color: string }[]) {
    this.roles = roles;
    this.saveToStorage();
  }

  // 🟣 Ereignisse abrufen
  getEvents(): { name: string; payer: string; amount: number; beneficiaries: string[] }[] {
    return this.events;
  }

  // 🟣 Ereignisse speichern
  setEvents(events: { name: string; payer: string; amount: number; beneficiaries: string[] }[]) {
    this.events = events;
    this.saveToStorage();
  }

  // 🟣 Ereignis hinzufügen
  addEvent(event: { name: string; payer: string; amount: number; beneficiaries: string[] }) {
    this.events.push(event);
    this.saveToStorage();
  }

  // 🔴 Bestimmte Rollenfarbe abrufen
  getRoleColor(role: string): string {
    const foundRole = this.roles.find(r => r.name === role);
    return foundRole ? foundRole.color : '#000000';
  }

  // 🟡 Daten sicher in localStorage speichern
  private saveToStorage() {
    if (typeof window !== 'undefined') { // ✅ Verhindert Fehler in SSR-Modus
      localStorage.setItem('users', JSON.stringify(this.users));
      localStorage.setItem('roles', JSON.stringify(this.roles));
      localStorage.setItem('events', JSON.stringify(this.events));
    }
  }

  // 🟡 Daten sicher aus localStorage laden
  private loadFromStorage() {
    if (typeof window !== 'undefined') { // ✅ Verhindert Fehler in SSR-Modus
      this.users = JSON.parse(localStorage.getItem('users') || '[]');
      this.roles = JSON.parse(localStorage.getItem('roles') || '[]');
      this.events = JSON.parse(localStorage.getItem('events') || '[]');
    }
  }
}




















