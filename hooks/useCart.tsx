import { CartProductType } from '@/app/product/[productId]/ProductDetails';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

type CartContextType = {
  cartTotalQty: number;
  cartTotalAmount: number;
  cartProducts: CartProductType[] | null;
  handleAddProductToCart: (product: CartProductType) => void;
  handleRemoveProductFromCart: (product: CartProductType) => void;
  handleCartQtyIncrease: (product: CartProductType) => void;
  handleCartQtyDecrease: (product: CartProductType) => void;
  handleClearCart: () => void;
  paymentIntent: string | null;
  handleSetPaymentIntent: (val: string | null) => void;
};

export const CartContext = createContext<CartContextType | null>(null);

interface Props {
  [propName: string]: any;
}

export const CartContextProvider = (props: Props) => {
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(null);
 const [paymentIntent, setPaymentIntent] = useState<string | null>(null);


  useEffect(() => {
    const cartItems: any = localStorage.getItem('eShoppyCartItems');

    const cartProducts: CartProductType[] | null = cartItems ? JSON.parse(cartItems) : null;

    const eShopPaymentIntent: any = localStorage.getItem('eShopPaymentIntent');
    const paymentIntent: string | null = JSON.parse(eShopPaymentIntent);

    setCartProducts(cartProducts);
    setPaymentIntent(paymentIntent);
  }, []);


  useEffect(() => {
    const getTotals = () => {
      if (cartProducts) {
        const { total, qty } = cartProducts?.reduce(
          (acc, item) => {
            const itemTotal = item.price * item.quantity;
            acc.total += itemTotal;
            acc.qty += item.quantity;
            return acc;
          },
          {
            total: 0,
            qty: 0,
          }
        );

        setCartTotalQty(qty);
        setCartTotalAmount(total);
      }
    };

    getTotals();
  }, [cartProducts]);

  const handleAddProductToCart = useCallback((product: CartProductType) => {
    setCartProducts((prev) => {
      let updateCart;

      if (prev) {
        updateCart = [...prev, product];
      } else {
        updateCart = [product];
      }

      toast.success('Added to your cart');
      localStorage.setItem('eShoppyCartItems', JSON.stringify(updateCart));

      return updateCart;
    });
  }, []);

  const handleRemoveProductFromCart = useCallback(
    (product: CartProductType) => {
      if (cartProducts) {
        const filteredProducts = cartProducts.filter((item) => item.id !== product.id);

        setCartProducts(filteredProducts);
        toast.success('Removed from your cart');
        localStorage.setItem('eShoppyCartItems', JSON.stringify(filteredProducts));
      }
    },
    [cartProducts]
  );

  const handleCartQtyIncrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;

      if (product.quantity === 99) {
        return toast.error('You can have a maximum of 99 items in your cart');
      }

      if (cartProducts) {
        updatedCart = [...cartProducts];
        const existingIndex = updatedCart.findIndex((item) => item.id === product.id);

        if (existingIndex > -1) {
          updatedCart[existingIndex].quantity += 1;
        }

        setCartProducts(updatedCart);
        localStorage.setItem('eShoppyCartItems', JSON.stringify(updatedCart));
        toast.success('Your cart has been added');
      }
    },
    [cartProducts]
  );

  const handleCartQtyDecrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;

      if (product.quantity === 1) {
        return toast.error('You can have at least 1 item in your cart');
      }

      if (cartProducts) {
        updatedCart = [...cartProducts];
        const existingIndex = updatedCart.findIndex((item) => item.id === product.id);

        if (existingIndex > -1) {
          updatedCart[existingIndex].quantity -= 1;
        }

        setCartProducts(updatedCart);
        localStorage.setItem('eShoppyCartItems', JSON.stringify(updatedCart));
        toast.success('Removed from your cart');
      }
    },
    [cartProducts]
  );

  const handleClearCart = useCallback(() => {
    setCartProducts(null);
    setCartTotalQty(0);
    setCartTotalAmount(0);
    localStorage.removeItem('eShoppyCartItems');
    toast.success('Your cart has been cleared');
  }, []);

  const handleSetPaymentIntent = useCallback((val: string | null) => {
    setPaymentIntent(val);
    localStorage.setItem('eShopPaymentIntent', JSON.stringify(val));

  }, [paymentIntent]);

  const value = {
    cartTotalQty,
    cartTotalAmount,
    cartProducts,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease,
    handleClearCart,
    paymentIntent,
    handleSetPaymentIntent,
  };

  return <CartContext.Provider value={value} {...props} />;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error('useCart must be used within a CartContextProvider');
  }

  return context;
};
