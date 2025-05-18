import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { useAuth } from '@/hooks/use-auth';
import { Redirect } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { EditableText } from '@/components/admin/editable-content';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash, Plus, Search, RefreshCcw } from 'lucide-react';

// Product form type
interface ProductFormData {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  subcategory?: string;
  inventory: number;
  inStock: boolean;
  isNew: boolean;
  isPopular: boolean;
  isSale: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  discountPercentage?: number;
}

const AdminProducts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productForm, setProductForm] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: 'tech',
    subcategory: '',
    inventory: 0,
    inStock: true,
    isNew: false,
    isPopular: false,
    isSale: false,
    isFeatured: false,
    isOnSale: false,
    discountPercentage: 0
  });

  // Redirect if not admin
  if (!user) {
    return <Redirect to="/auth" />;
  }

  // Fetch products
  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    }
  });

  // Add product mutation
  const { mutate: addProduct, isPending: isAddingProduct } = useMutation({
    mutationFn: async (product: ProductFormData) => {
      const response = await apiRequest('POST', '/api/admin/products', product);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Product Added',
        description: 'The product has been added successfully.',
      });
      setIsAddProductOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Add Product',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Update product mutation
  const { mutate: updateProduct, isPending: isUpdatingProduct } = useMutation({
    mutationFn: async (product: any) => {
      const response = await apiRequest('PUT', `/api/admin/products/${product.id}`, product);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Product Updated',
        description: 'The product has been updated successfully.',
      });
      setEditingProduct(null);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Update Product',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Delete product mutation
  const { mutate: deleteProduct, isPending: isDeletingProduct } = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/admin/products/${id}`);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Product Deleted',
        description: 'The product has been deleted successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Delete Product',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setProductForm({ ...productForm, [name]: parseFloat(value) || 0 });
    } else {
      setProductForm({ ...productForm, [name]: value });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (field: string, checked: boolean) => {
    setProductForm({ ...productForm, [field]: checked });
  };

  // Handle select changes
  const handleSelectChange = (field: string, value: string) => {
    setProductForm({ ...productForm, [field]: value });
  };

  // Reset form
  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: 'tech',
      subcategory: '',
      inventory: 0,
      inStock: true,
      isNew: false,
      isPopular: false,
      isSale: false,
      isFeatured: false,
      isOnSale: false,
      discountPercentage: 0
    });
  };

  // Start editing a product
  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price / 100, // Convert cents to dollars for UI
      imageUrl: product.imageUrl,
      category: product.category,
      subcategory: product.subcategory || '',
      inventory: product.inventory || 0,
      inStock: product.inStock || true,
      isNew: product.isNew || false,
      isPopular: product.isPopular || false,
      isSale: product.isSale || false,
      isFeatured: product.isFeatured || false,
      isOnSale: product.isOnSale || false,
      discountPercentage: product.discountPercentage || 0
    });
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!productForm.name || !productForm.description || !productForm.imageUrl) {
      toast({
        title: 'Validation Error',
        description: 'Please fill out all required fields.',
        variant: 'destructive',
      });
      return;
    }

    // Convert price to cents for API
    const formData = {
      ...productForm,
      price: Math.round(productForm.price * 100), // Convert dollars to cents for API
    };

    if (editingProduct) {
      updateProduct({ ...formData, id: editingProduct.id });
    } else {
      addProduct(formData);
    }
  };

  // Filter products based on search query
  const filteredProducts = products ? products.filter((product: any) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    );
  }) : [];

  return (
    <>
      <Helmet>
        <title>Manage Products | THRAX Admin</title>
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 container max-w-7xl py-10 px-4 mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manage Products</h1>
            <EditableText
              id="product-admin-description"
              path="db:site_content:value:product-admin-description"
            >
              Add, edit, and manage your product catalog
            </EditableText>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="flex items-center"
              >
                <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
              </Button>
              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Fill out the form below to add a new product to your catalog.
                    </DialogDescription>
                  </DialogHeader>
                  {renderProductForm()}
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Products table */}
          <Card>
            <CardHeader>
              <CardTitle>Product Catalog</CardTitle>
              <CardDescription>
                {filteredProducts.length} products found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-10 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground">No products found.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-center">Stock</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product: any) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-10 w-10 object-cover rounded-md"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell className="text-right">
                            ${(product.price / 100).toFixed(2)}
                            {product.isOnSale && (
                              <span className="ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">
                                SALE
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleEditProduct(product)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Edit Product</DialogTitle>
                                    <DialogDescription>
                                      Make changes to the product details and save them.
                                    </DialogDescription>
                                  </DialogHeader>
                                  {renderProductForm()}
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-red-500"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                                    deleteProduct(product.id);
                                  }
                                }}
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    </>
  );

  // Product form render function
  function renderProductForm() {
    return (
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={productForm.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={productForm.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={productForm.imageUrl}
                onChange={handleInputChange}
                required
              />
              {productForm.imageUrl && (
                <div className="mt-2">
                  <img
                    src={productForm.imageUrl}
                    alt="Product preview"
                    className="h-20 w-20 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={productForm.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Tech</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="beauty">Beauty</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subcategory">Subcategory (Optional)</Label>
              <Input
                id="subcategory"
                name="subcategory"
                value={productForm.subcategory || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="inventory">Inventory</Label>
              <Input
                id="inventory"
                name="inventory"
                type="number"
                min="0"
                value={productForm.inventory}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                className="w-full h-36 px-3 py-2 rounded-md border border-input bg-background"
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                required
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={productForm.inStock}
                  onCheckedChange={(checked) => handleCheckboxChange('inStock', !!checked)}
                />
                <Label htmlFor="inStock">In Stock</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isNew"
                  checked={productForm.isNew}
                  onCheckedChange={(checked) => handleCheckboxChange('isNew', !!checked)}
                />
                <Label htmlFor="isNew">New Arrival</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPopular"
                  checked={productForm.isPopular}
                  onCheckedChange={(checked) => handleCheckboxChange('isPopular', !!checked)}
                />
                <Label htmlFor="isPopular">Popular</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFeatured"
                  checked={productForm.isFeatured}
                  onCheckedChange={(checked) => handleCheckboxChange('isFeatured', !!checked)}
                />
                <Label htmlFor="isFeatured">Featured</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isOnSale"
                  checked={productForm.isOnSale}
                  onCheckedChange={(checked) => handleCheckboxChange('isOnSale', !!checked)}
                />
                <Label htmlFor="isOnSale">On Sale</Label>
              </div>
              {productForm.isOnSale && (
                <div>
                  <Label htmlFor="discountPercentage">Discount Percentage</Label>
                  <Input
                    id="discountPercentage"
                    name="discountPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={productForm.discountPercentage || 0}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsAddProductOpen(false);
              setEditingProduct(null);
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isAddingProduct || isUpdatingProduct}>
            {isAddingProduct || isUpdatingProduct ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                {editingProduct ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>{editingProduct ? 'Update Product' : 'Add Product'}</>
            )}
          </Button>
        </DialogFooter>
      </form>
    );
  }
};

export default AdminProducts;