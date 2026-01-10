import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CompassBack } from "@/components/ui/CompassBack";
import { ShopifyProduct, CartItem, storefrontApiRequest, fetchProducts } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { ArrowLeft, ShoppingCart, Check, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import tradeRoutesBg from "@/assets/trade-routes-bg.jpg";

const PRODUCT_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      descriptionHtml
      handle
      productType
      tags
      vendor
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            id
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

interface RelatedProductCardProps {
  product: ShopifyProduct;
}

function RelatedProductCard({ product }: RelatedProductCardProps) {
  const { node } = product;
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const imageUrl = node.images.edges[0]?.node.url;
  
  return (
    <Link 
      to={`/product/${node.handle}`}
      className="group block bg-ink/50 border border-tyrian/30 rounded-sm overflow-hidden hover:border-gold/40 transition-all"
    >
      <div className="aspect-square overflow-hidden bg-parchment/5">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={node.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-parchment/30">
            No image
          </div>
        )}
      </div>
      <div className="p-3">
        <h4 className="font-heading text-sm text-parchment line-clamp-1 group-hover:text-gold transition-colors">
          {node.title}
        </h4>
        <p className="font-heading text-gold mt-1">${price.toFixed(2)}</p>
      </div>
    </Link>
  );
}

export default function ProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    async function fetchProductAndRelated() {
      if (!handle) return;
      
      try {
        const [productData, allProducts] = await Promise.all([
          storefrontApiRequest(PRODUCT_QUERY, { handle }),
          fetchProducts(100)
        ]);
        
        if (productData?.data?.productByHandle) {
          const currentProduct = productData.data.productByHandle;
          setProduct(currentProduct);
          
          // Set default variant
          const firstVariant = currentProduct.variants.edges[0]?.node;
          if (firstVariant) {
            setSelectedVariantId(firstVariant.id);
          }
          
          // Filter related products (same product type, excluding current product)
          const related = allProducts.filter(p => 
            p.node.handle !== handle && 
            p.node.productType === currentProduct.productType
          ).slice(0, 4);
          
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }

    // Reset state when handle changes
    setLoading(true);
    setCurrentImageIndex(0);
    setQuantity(1);
    setIsAdded(false);
    
    fetchProductAndRelated();
  }, [handle]);

  const images = product?.images.edges || [];
  const variants = product?.variants.edges || [];
  const selectedVariant = variants.find(v => v.node.id === selectedVariantId)?.node;
  const hasMultipleVariants = variants.length > 1;
  const isConsortium = product?.productType === "Pepper Consortium";

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    
    const cartItem: CartItem = {
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    setIsAdded(true);
    
    toast.success(`${product.title} added to manifest`, {
      position: "top-center"
    });
    
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-parchment/60 font-heading">Loading cargo manifest...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-ink flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-2xl text-parchment mb-4">Product Not Found</h1>
            <Link to="/trading-post">
              <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Trading Post
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink flex flex-col relative">
      {/* Global background pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img 
          src={tradeRoutesBg} 
          alt="" 
          className="w-full h-full object-cover opacity-8"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/90 to-ink" />
      </div>
      
      <Header />
      
      <main className="flex-1 py-12 relative z-10">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Link 
            to="/trading-post" 
            className="inline-flex items-center text-parchment/60 hover:text-gold transition-colors mb-8 font-heading text-sm uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Trading Post
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery with Compass Navigation */}
            <div className="space-y-4">
              {/* Compass positioned outside image on desktop, above on mobile */}
              <div className="flex items-start gap-6">
                <CompassBack className="hidden lg:block flex-shrink-0 -ml-2" />
                <div className="flex-1 space-y-4">
                  <div className="lg:hidden mb-2">
                    <CompassBack />
                  </div>
                  <div className="relative aspect-square bg-parchment/5 border border-tyrian/30 rounded-sm overflow-hidden">
                    {images.length > 0 ? (
                      <img
                        src={images[currentImageIndex].node.url}
                        alt={images[currentImageIndex].node.altText || product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-parchment/30">
                        No image available
                      </div>
                    )}
                    
                    {/* Navigation arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-ink/80 rounded-full flex items-center justify-center text-parchment hover:bg-ink transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-ink/80 rounded-full flex items-center justify-center text-parchment hover:bg-ink transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    
                    {/* Product Type Badge */}
                    {isConsortium && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-tyrian text-parchment text-xs uppercase tracking-wider font-heading">
                          Consortium
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Thumbnail strip */}
                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {images.map((img, index) => (
                        <button
                          key={img.node.id || index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 border-2 rounded-sm overflow-hidden transition-all ${
                            index === currentImageIndex 
                              ? 'border-gold' 
                              : 'border-parchment/20 hover:border-parchment/40'
                          }`}
                        >
                          <img
                            src={img.node.url}
                            alt={img.node.altText || `${product.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-parchment/60 font-heading text-sm uppercase tracking-wider mb-2">
                  {product.vendor}
                </p>
                <h1 className="font-heading text-4xl text-parchment mb-4">
                  {product.title}
                </h1>
                <div className="flex items-baseline gap-2">
                  <p className="font-heading text-3xl text-gold">
                    ${parseFloat(selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount).toFixed(2)}
                  </p>
                  <span className="text-parchment/50 text-sm font-heading">2 oz (56.70g)</span>
                </div>
              </div>

              {/* Variant Selection */}
              {hasMultipleVariants && (
                <div className="space-y-3">
                  <label className="text-parchment/80 font-heading text-sm uppercase tracking-wider">
                    Select Option
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variants.map(({ node: variant }) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariantId(variant.id)}
                        disabled={!variant.availableForSale}
                        className={`px-4 py-2 border rounded-sm font-heading text-sm transition-all ${
                          selectedVariantId === variant.id
                            ? 'border-gold bg-gold/10 text-gold'
                            : variant.availableForSale
                              ? 'border-parchment/30 text-parchment hover:border-parchment/60'
                              : 'border-parchment/10 text-parchment/30 cursor-not-allowed'
                        }`}
                      >
                        {variant.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3">
                <label className="text-parchment/80 font-heading text-sm uppercase tracking-wider">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 border border-parchment/30 rounded-sm flex items-center justify-center text-parchment hover:border-parchment/60 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-parchment font-heading text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 border border-parchment/30 rounded-sm flex items-center justify-center text-parchment hover:border-parchment/60 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale}
                className={`w-full font-heading uppercase tracking-wider text-sm py-6 transition-all ${
                  isAdded 
                    ? 'bg-green-600 hover:bg-green-600 text-white' 
                    : 'bg-pepper-red hover:bg-pepper-red/90 text-parchment'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Added to Manifest
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cargo Manifest
                  </>
                )}
              </Button>

              {/* Description */}
              <div className="pt-6 border-t border-parchment/10 space-y-4">
                <h2 className="font-heading text-xl text-parchment">Description</h2>
                <div 
                  className="prose prose-invert prose-sm max-w-none text-parchment/80"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
                />
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="pt-4 space-y-2">
                  <h3 className="font-heading text-sm uppercase tracking-wider text-parchment/60">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag: string) => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 bg-parchment/5 border border-parchment/10 rounded-sm text-xs text-parchment/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-tyrian/30">
              <h2 className="font-heading text-2xl text-parchment mb-8">
                {isConsortium ? "Other Consortiums" : "Similar Cultivars"}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedProducts.map(p => (
                  <RelatedProductCard key={p.node.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
