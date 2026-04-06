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

  // Make Math available in template
  Math = Math;

  quantity: number = 0;
  unitPrice: number = 0;
  pricePerItem: number = 0;
  pricePerItemUSD: number = 0;
  pricePerItemKHR: number = 0;
  exchangerate: any = {};
  salePrice: number = 0;
  profit: number = 0;
  inputCurrency: string = 'USD'; // 'USD' or 'KHR'

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
        // Input is in USD, keep decimals
        this.pricePerItemUSD = this.unitPrice / this.quantity;
        // Convert to KHR (round to nearest 100 to avoid small amounts)
        const khrRate = this.exchangerate?.rates?.KHR || 4000;
        this.pricePerItemKHR = Math.round((this.pricePerItemUSD * khrRate) / 100) * 100;
      } else {
        // Input is in KHR
        this.pricePerItemKHR = Math.round(this.unitPrice / this.quantity / 100) * 100;
        // Convert to USD
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
      let profit = 0;

      if (this.inputCurrency === 'USD') {
        const costUSD = this.quantity * this.unitPrice;
        const totalSaleUSD = this.quantity * this.salePrice;
        const profitUSD = totalSaleUSD - costUSD;
        // Convert to KHR and round to nearest 100
        return Math.round((profitUSD * khrRate) / 100) * 100;
      } else {
        // Input is in KHR, assume salePrice is also in KHR
        const costKHR = this.quantity * this.unitPrice;
        const totalSaleKHR = this.quantity * this.salePrice;
        return Math.round((totalSaleKHR - costKHR) / 100) * 100;
      }
    }
    return 0;
  }


  getProfit() {
    if (this.salePrice) {
      return (this.quantity * this.salePrice) - (this.quantity * this.pricePerItemUSD);
    }
    return 0;
  }
}
