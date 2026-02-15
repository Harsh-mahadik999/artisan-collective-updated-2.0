import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/App";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export default function ShoppingCart() {
  const { items, updateQuantity, removeFromCart, total, isOpen, setIsOpen } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-96 sm:w-[400px]" data-testid="sheet-shopping-cart">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5" />
            <span>Shopping Cart</span>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground" data-testid="text-empty-cart">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg" data-testid={`cart-item-${item.id}`}>
                    <img 
                      src={item.product.images?.[0] || "/placeholder-product.jpg"} 
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm" data-testid={`text-item-name-${item.id}`}>
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-muted-foreground" data-testid={`text-item-artisan-${item.id}`}>
                        by {item.product.artisanName}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-primary font-bold" data-testid={`text-item-price-${item.id}`}>
                          ${item.product.price}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="h-6 w-6"
                            data-testid={`button-decrease-${item.id}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center" data-testid={`text-item-quantity-${item.id}`}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6"
                            data-testid={`button-increase-${item.id}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                            className="h-6 w-6 text-destructive hover:text-destructive"
                            data-testid={`button-remove-${item.id}`}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="text-xl font-bold text-primary" data-testid="text-cart-total">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <Button 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-checkout"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
