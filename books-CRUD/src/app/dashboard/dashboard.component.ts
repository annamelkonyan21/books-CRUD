import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {State} from '@progress/kendo-data-query';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BooksService} from '../services/books/books.service';
import {NotificationService, NotificationSettings} from '@progress/kendo-angular-notification';
import {CategoriesService} from '../services/categories/categories.service';
import {IBook} from '../interfaces/book.interface';
import {ICategory} from '../interfaces/category.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  public books: Array<IBook> = [];
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  public bookForm: FormGroup;
  public id: FormControl;
  public title: FormControl;
  public author: FormControl;
  public category: FormControl;
  public date: FormControl;

  private editedRowIndex: number;
  public categories: Array<ICategory> = [];

  constructor(private _booksService: BooksService,
              private _notificationService: NotificationService,
              private _categoriesService: CategoriesService,
              private fb: FormBuilder) {
  }

  public ngOnInit(): void {
    this.getCategories();
    this.getBooks();
    this.createFormControls();
  }

  private getBooks() {
    this._booksService
      .getAllBooks()
      .subscribe((books) => {
        this.books = books;
        this.books.forEach((book) => book['date'] = new Date(book.date));
      });
  }

  private getCategories() {
    this._categoriesService
      .getAllCategories()
      .subscribe((categories) => {
        this.categories = categories;
      });
  }

  public onStateChange(state: State) {
    this.gridState = state;
  }

  public addHandler({sender}) {
    this.closeEditor(sender);
    sender.addRow(this.bookForm);
    this.id.setValue('');
    this.title.setValue('');
    this.author.setValue('');
    this.category.setValue('');
    this.date.setValue(new Date());
  }

  public editHandler({sender, rowIndex, dataItem}) {
    this.closeEditor(sender);
    this.id.setValue(dataItem.id);
    this.title.setValue(dataItem.title);
    this.author.setValue(dataItem.author);
    this.category.setValue(dataItem.category);
    this.date.setValue(dataItem.date);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.bookForm);
  }

  private createFormControls() {
    this.id = new FormControl('');
    this.title = new FormControl('', [Validators.required]);
    this.author = new FormControl('');
    this.category = new FormControl('');
    this.date = new FormControl(new Date());
    this.createFormGroup();
  }

  private createFormGroup() {
    this.bookForm = this.fb.group({
      id: this.id,
      title: this.title,
      author: this.author,
      category: this.category,
      date: this.date
    });
  }

  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({sender, rowIndex, isNew}) {
    const book: IBook = this.bookForm.getRawValue();
    console.log(this.bookForm.dirty);
    if (isNew) {
      this.createBook(book);
    } else {
        this.updateBook(book);
    }
    sender.closeRow(rowIndex);
  }

  private createBook(book: IBook) {
    this._booksService
      .createBook(book)
      .subscribe((savedBook) => {
        this.books.push(savedBook);
        this.showNotification('Your Book Create Successfully!', 'success');
      }, () => {
        this.showNotification('Something went wrong!', 'error');
      });
  }

  private updateBook(book: IBook) {
    this._booksService
      .updateBook(book.id, book)
      .subscribe((updatedBook) => {
        this.id.setValue(updatedBook.id);
        this.title.setValue(updatedBook.title);
        this.author.setValue(updatedBook.author);
        this.category.setValue(updatedBook.category);
        this.date.setValue(new Date(updatedBook.date));
        this.showNotification('Your Book Updated Successfully!', 'success');
      }, () => {
        this.showNotification('Something went wrong!', 'error');
      });
  }

  public removeHandler({dataItem, rowIndex}) {
    this._booksService.deleteBook(dataItem.id)
      .subscribe(() => {
        this.showNotification(`You deleted ${dataItem.title} book!`, 'error');
        this.books.splice(rowIndex, 1);
      });
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  private setValues(event: string, type: string) {
    if (type === 'category') {
      const currentCategory = this.categories.find((category: ICategory) => category.categoryId === Number(event));
      this.category.setValue(currentCategory);
    }
    if (type === 'date') {
      this.date.setValue(event);
    }
  }

  private showNotification(content: string, type: string) {
    const settings: NotificationSettings = {
      content: content,
      cssClass: 'button-notification',
      animation: {
        duration: 600
      },
      position: {
        horizontal: 'right',
        vertical: 'top'
      },
      type: {
        icon: true
      }
    };
    if (type === 'success') {
      settings.type.style = 'success';
      settings.animation.type = 'slide';
    } else {
      settings.type.style = 'error';
      settings.animation.type = 'fade';
    }

    this._notificationService.show(settings);
  }
}
