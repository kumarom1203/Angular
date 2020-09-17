import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from './http-service.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'provab';

  selectAll: boolean = false;

  bookList: any = [];

  bookListDatabase: any = [];

  selectedItems: any;

  constructor(
    private httpServiceService: HttpServiceService
  ) { }

  ngOnInit() {
    this.getBookList()
  }

  getBookList() {
    this.httpServiceService.getBookList().subscribe((res) => {
      this.bookListDatabase = res;
      this.bookList = this.formatData(res);

      console.log(this.bookList)
    }, (err) => {
      alert('Failed to fetch books list')
    })
  }

  formatData(data) {
    let groupBranch = Object.values(_.groupBy(data, 'type'));
    let bookArr = [];
    groupBranch.forEach((element) => {
      let branch = {};
      branch['name'] = element[0].type + ' Branch';
      branch['selected'] = false;
      branch['items'] = this.getUpdatedItems(element);;
      bookArr.push(branch)
    })
    return bookArr;
  }

  getUpdatedItems(data) {
    let items = [];
    data.forEach((elm) => {
      elm['selected'] = false;
      items.push(elm)
    })
    return items;
  }

  toggleBranch(book) {
    book.items = book.items.map((item) => {
      item.selected = book.selected
      return item;
    });
    this.selectAll = this.totalSelectedBooksCount() === this.bookListDatabase.length ? true : false;
  }

  toggleBook(book) {
    let selectedBooks = book.items.filter((el) => el.selected === true)
    if (selectedBooks.length === book.items.length) {
      book.selected = true;
      this.selectAll = this.totalSelectedBooksCount() === this.bookListDatabase.length ? true : false;
    } else {
      book.selected = false;
      this.selectAll = false;
    }
  }

  selectedBooksCount(books) {
    return books.filter((el) => el.selected === true).length;
  }

  totalSelectedBooksCount() {
    let totalSelection = this.bookList.map((element) => {
      return element.items.filter((elm) => elm.selected === true).length
    })
    return totalSelection.reduce((total, num) => total + num);
  }

  toggleAllBranch() {
    this.bookList.forEach((element) => {
      element.selected = this.selectAll ? true : false;
      this.updateBranch(element);
    })
  }

  updateBranch(book) {
    book.items = book.items.map((item) => {
      item.selected = book.selected
      return item;
    });
  }

  getSelectedItems() {
    this.selectedItems = _.flatten(this.bookList.map((element) => {
      return element.items.filter((elm) => elm.selected === true).map((el) => el.id)
    }))
  }
  
  selectAllAtOnce(boolean) {
    this.selectAll = boolean;
    this.bookList.forEach((element) => {
      element.selected = this.selectAll;
      this.updateBranch(element);
    })
  }
}


