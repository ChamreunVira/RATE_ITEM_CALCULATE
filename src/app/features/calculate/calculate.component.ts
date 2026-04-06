import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyService } from '../../core/servicxe/currency.service';
import { CurrencyPipe, NgIf } from '@angular/common';
@Component({
  selector: 'app-calculate',
  imports: [FormsModule, NgIf],
  templateUrl: './calculate.component.html',
  styleUrl: './calculate.component.css',
})

export class CalculateComponent implements OnInit {

  constructor(private currencyService: CurrencyService) { }

  Math = Math;
  quantity: number = 0;
  unitPrice: number = 0;
  pricePerItem: number = 0;
  pricePerItemUSD: number = 0;
  pricePerItemKHR: number = 0;
  exchangerate: any = {};
  salePrice: number = 0;
  profit: number = 0;
  inputCurrency: string = 'USD';
  salePriceType: 'perItem' | 'total' = 'perItem';
  saleCurrency: string = 'USD';

  ngOnInit(): void {
    this.loadExcangerate();
  }

  loadExcangerate() {
    this.currencyService.getExchangeCurrency().subscribe((res) => {
      this.exchangerate = res;
    });
  }

  handleCalculatePricePerItem() {
    if (this.quantity !== 0 && this.unitPrice !== 0) {
      if (this.inputCurrency === 'USD') {
        this.pricePerItemUSD = this.unitPrice / this.quantity;
        const khrRate = this.exchangerate?.rates?.KHR || 4000;
        this.pricePerItemKHR = Math.round((this.pricePerItemUSD * khrRate) / 100) * 100;
      } else {
        this.pricePerItemKHR = Math.round(this.unitPrice / this.quantity / 100) * 100;
        const khrRate = this.exchangerate?.rates?.KHR || 4000;
        this.pricePerItemUSD = this.pricePerItemKHR / khrRate;
      }
      this.pricePerItem = this.inputCurrency === 'USD' ? this.pricePerItemUSD : this.pricePerItemKHR;
    }
  }

  getTotalKHR() {
    return Math.round((this.quantity * this.pricePerItemKHR) / 100) * 100;
  }

  getTotalUSD() {
    return parseFloat((this.quantity * this.pricePerItemUSD).toFixed(2));
  }

  getProfitUSD() {
    const khrProfit = this.getProfitKHR();
    const khrRate = this.exchangerate?.rates?.KHR || 4000;
    return parseFloat((khrProfit / khrRate).toFixed(2));
  }

  getProfitKHR() {
    if (this.salePrice && this.quantity > 0) {
      const khrRate = this.exchangerate?.rates?.KHR || 4000;

      const totalCostKHR = this.quantity * this.pricePerItemKHR;
      let totalSaleKHR = 0;
      const saleAmount = this.salePriceType === 'perItem'
        ? this.quantity * this.salePrice
        : this.salePrice;

      if (this.saleCurrency === 'USD') {
        totalSaleKHR = saleAmount * khrRate;
      } else {
        totalSaleKHR = saleAmount;
      }

      return Math.round((totalSaleKHR - totalCostKHR) / 100) * 100;
    }
    return 0;
  }


  getProfit() {
    if (this.salePrice) {
      const totalSale = this.salePriceType === 'perItem' ? this.quantity * this.salePrice : this.salePrice;
      const totalCost = this.quantity * (this.inputCurrency === 'USD' ? this.pricePerItemUSD : this.pricePerItemKHR);
      return totalSale - totalCost;
    }
    return 0;
  }
}
