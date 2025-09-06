import { useCart } from '@/hooks/useCart';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CartPopupProps {
  show: boolean;
}

export function CartPopup({ show }: CartPopupProps) {
  const { items, total, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (!show) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 z-50">
      <Card className={`cart-popup ${show ? 'show' : ''} shadow-xl border-2 bg-gradient-card`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Cart ({items.length})
            </h3>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Your cart is empty</p>
              <p className="text-sm">Add some eco-friendly products!</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.slice(0, 3).map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-3 p-2 rounded-lg bg-background/50">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.title}</p>
                      <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {items.length > 3 && (
                  <div className="text-center text-sm text-muted-foreground py-2">
                    +{items.length - 3} more items
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total:</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/cart')}
                  >
                    View Cart
                  </Button>
                  <Button 
                    variant="eco" 
                    size="sm"
                    onClick={() => navigate('/checkout')}
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}