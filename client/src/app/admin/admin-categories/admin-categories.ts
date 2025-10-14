import {Component, OnInit} from '@angular/core';
import {Category} from '../../event-service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CategoryService} from '../../category-service';

@Component({
  selector: 'app-admin-categories',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css'
})
export class AdminCategories implements OnInit {
  categories: any[] = [];
  loading = false;
  saving = false;
  error = '';
  success = '';

  // modal state
  showModal = false;
  modalError = '';
  editingId: number | null = null;
  form = {
    name: '',
    description: ''
  };

  constructor(private categoryService: CategoryService) {}

  // init to load categories
  ngOnInit(): void {
    this.load();
  }

  // clear error/success message
  clearNotices() {
    this.error = '';
    this.success = '';
  }

  load() {
    this.clearNotices();

    // show loading
    this.loading = true;

    // call service to get categories
    this.categoryService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res;
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.error = e?.error?.error?.message || 'Failed to load categories';
      }
    });
  }

  // open create modal
  openCreateModal() {
    this.modalError = '';
    this.editingId = null;
    // reset form value
    this.form = {
      name: '',
      description: ''
    };
    this.showModal = true;
  }

  // open edit mdal
  openEditModal(c: any) {
    this.modalError = '';
    this.editingId = c.id;
    // fill form value
    this.form = {
      name: c.name,
      description: c.description
    };
    this.showModal = true;
  }

  // close modal
  closeModal() {
    this.showModal = false;
    this.modalError = '';
  }

  // submit form
  submit() {
    // validate name value
    if (!this.form.name.trim()) {
      this.modalError = 'Name is required';
      return;
    }

    // show saving
    this.saving = true;

    // build request body
    const body = {
      name: this.form.name.trim(),
      description: this.form.description?.trim()
    };

    // create api observable according to editing flag
    const apiObservable = this.editingId
      ? this.categoryService.updateCategory(this.editingId, body)
      : this.categoryService.createCategory(body);

    apiObservable.subscribe({
      next: () => {
        // hide save and modal, show success message
        this.saving = false;
        this.showModal = false;
        this.success = this.editingId ? 'Updated successfully' : 'Created successfully';
        // reload categories
        this.load();
      },
      error: (e) => {
        this.saving = false;
        this.modalError = e?.error?.error?.message || (this.editingId ? 'Update failed' : 'Create failed');
      }
    });
  }

  // delete category
  delete(category: Category) {
    // show confirm message
    if (confirm("Do you really want to delete the category?")) {
      // clear all notices
      this.clearNotices();

      // call service to delete
      this.categoryService.deleteCategory(category.id).subscribe({
        next: () => {
          this.success = 'Deleted successfully';
          this.load();
        },
        error: (e) => {
          this.error = e?.error?.error?.message || 'Delete failed';
        }
      });
    }
  }
}
