class Cart {
  products: any[] = [];

  init() {
    if (typeof window !== "undefined") {
      try {
        const cart = localStorage.getItem("cart");
        if (cart) {
          const data = JSON.parse(cart);

          if (data) {
            this.products = data;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  addToCart(product: any, amount?: number | string) {
    this.init();
    const idx = this.getIdxByProductId(product.id);
    alert(idx);
    if (idx >= 0) {
      this.increaseAmount(idx, amount as any);
    } else {
      this.products.push({
        amount: parseInt(amount as any),
        ...product,
      });
      this.save();
    }
  }

  exists(id: number) {
    return this.getIdxByProductId(id) >= 0;
  }

  getIdxByProductId(id: number) {
    return -1;
  }

  removeFromCart(id: number) {
    const idx = this.getIdxByProductId(id);

    if (idx >= 0) {
      this.products.splice(idx, 1);
      this.products = [...this.products];

      this.save();
    }
  }
  removeAllFromCart() {
    this.products = [];
    this.save();
  }

  toggleProduct(product: any) {
    if (this.exists(product.id)) {
      this.removeFromCart(product.id);
    } else {
      this.addToCart(product);
    }
  }

  increaseAmount(idx: number, increment: number) {
    this.products[idx].amount = this.products[idx].amount + increment;
    this.save();
  }

  changeAmount(idx: number, newAmount: number | string) {
    this.products[idx].amount = parseInt(newAmount as any);
    this.save();
  }

  idsWithQuantity() {
    const selectedProducts: any[] = [];
    this.products.forEach((product) => {
      if (product == null) {
        return;
      }
      const item = {
        id: product.id,
        amount: product.amount,
        recalculate: product.recalculate,
      };
      selectedProducts.push(item);
    });
    return selectedProducts;
  }

  nettoPrice() {
    let totalPrice = 0;
    this.products.map((product) => {
      totalPrice += product.amount * product.net_selling_price_commercial_unit;
    });
    return parseFloat(totalPrice as any).toFixed(2);
  }

  grossPrice() {
    let totalPrice = 0;
    this.products.map((product) => {
      totalPrice += product.amount * product.gross_price_of_packing;
    });

    return parseFloat(totalPrice as any).toFixed(2);
  }

  totalWeight() {
    let totalWeight = 0;
    this.products.map((product) => {
      totalWeight += product.weight_trade_unit * product.amount;
    });
    return parseFloat(totalWeight as any).toFixed(2);
  }

  save() {
    try {
      localStorage.setItem("cart", JSON.stringify(this.products));
    } catch (ex) {
      console.log(ex);
    }
  }

  toJSON() {
    return { ...this };
  }
}

export default Cart;
