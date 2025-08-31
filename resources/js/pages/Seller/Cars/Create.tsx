import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Plus } from 'lucide-react';

const FUEL_TYPES = [
    { value: 'petrol', label: 'Petrol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'electric', label: 'Electric' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'cng', label: 'CNG' },
];

const TRANSMISSION_TYPES = [
    { value: 'manual', label: 'Manual' },
    { value: 'automatic', label: 'Automatic' },
    { value: 'cvt', label: 'CVT' },
];

const COMMON_FEATURES = [
    'Air Conditioning', 'Power Steering', 'Power Windows', 'ABS', 'Airbags',
    'Alloy Wheels', 'Bluetooth', 'GPS Navigation', 'Backup Camera', 'Sunroof',
    'Leather Seats', 'Heated Seats', 'Cruise Control', 'Keyless Entry', 'Remote Start'
];

export default function CreateCar() {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        mileage: '',
        fuel_type: '',
        transmission: '',
        price: '',
        currency: 'INR',
        location: '',
        city: '',
        state: '',
        country: 'India',
        description: '',
        features: [],
        video_url: '',
        images: [] as File[],
    });

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (selectedImages.length + files.length > 10) {
            alert('Maximum 10 images allowed');
            return;
        }
        setSelectedImages([...selectedImages, ...files]);
        setData('images', [...selectedImages, ...files]);
    };

    const removeImage = (index: number) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(newImages);
        setData('images', newImages);
    };

    const toggleFeature = (feature: string) => {
        const newFeatures = selectedFeatures.includes(feature)
            ? selectedFeatures.filter(f => f !== feature)
            : [...selectedFeatures, feature];
        
        setSelectedFeatures(newFeatures);
        setData('features', newFeatures);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'images') {
                selectedImages.forEach((image, index) => {
                    formData.append(`images[${index}]`, image);
                });
            } else if (key === 'features') {
                selectedFeatures.forEach((feature, index) => {
                    formData.append(`features[${index}]`, feature);
                });
            } else {
                formData.append(key, (data as any)[key]);
            }
        });

        post(route('seller.cars.store'), {
            data: formData,
            forceFormData: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Add New Car" />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Add New Car</h1>
                    <p className="text-gray-600">Create a new car listing</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="brand">Brand *</Label>
                                    <Input
                                        id="brand"
                                        value={data.brand}
                                        onChange={(e) => setData('brand', e.target.value)}
                                        placeholder="e.g., Toyota, Honda, BMW"
                                        required
                                    />
                                    {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="model">Model *</Label>
                                    <Input
                                        id="model"
                                        value={data.model}
                                        onChange={(e) => setData('model', e.target.value)}
                                        placeholder="e.g., Camry, Civic, X5"
                                        required
                                    />
                                    {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="year">Year *</Label>
                                    <Input
                                        id="year"
                                        type="number"
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        value={data.year}
                                        onChange={(e) => setData('year', parseInt(e.target.value))}
                                        required
                                    />
                                    {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="mileage">Mileage (km) *</Label>
                                    <Input
                                        id="mileage"
                                        type="number"
                                        min="0"
                                        value={data.mileage}
                                        onChange={(e) => setData('mileage', e.target.value)}
                                        placeholder="e.g., 50000"
                                        required
                                    />
                                    {errors.mileage && <p className="text-red-500 text-sm mt-1">{errors.mileage}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="price">Price *</Label>
                                    <div className="flex">
                                        <Select value={data.currency} onValueChange={(value) => setData('currency', value)}>
                                            <SelectTrigger className="w-20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="INR">INR</SelectItem>
                                                <SelectItem value="USD">USD</SelectItem>
                                                <SelectItem value="EUR">EUR</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            placeholder="e.g., 500000"
                                            className="flex-1 ml-2"
                                            required
                                        />
                                    </div>
                                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="fuel_type">Fuel Type *</Label>
                                    <Select value={data.fuel_type} onValueChange={(value) => setData('fuel_type', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select fuel type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {FUEL_TYPES.map(type => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.fuel_type && <p className="text-red-500 text-sm mt-1">{errors.fuel_type}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="transmission">Transmission *</Label>
                                    <Select value={data.transmission} onValueChange={(value) => setData('transmission', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select transmission" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TRANSMISSION_TYPES.map(type => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.transmission && <p className="text-red-500 text-sm mt-1">{errors.transmission}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Location Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="location">Detailed Location *</Label>
                                <Input
                                    id="location"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="e.g., Near City Mall, Main Road"
                                    required
                                />
                                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="city">City *</Label>
                                    <Input
                                        id="city"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        placeholder="e.g., Mumbai"
                                        required
                                    />
                                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="state">State *</Label>
                                    <Input
                                        id="state"
                                        value={data.state}
                                        onChange={(e) => setData('state', e.target.value)}
                                        placeholder="e.g., Maharashtra"
                                        required
                                    />
                                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="country">Country *</Label>
                                    <Input
                                        id="country"
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                        required
                                    />
                                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Description & Features</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Describe your car in detail..."
                                    rows={4}
                                    required
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                            </div>
                            
                            <div>
                                <Label>Features</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                    {COMMON_FEATURES.map(feature => (
                                        <div key={feature} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={feature}
                                                checked={selectedFeatures.includes(feature)}
                                                onCheckedChange={() => toggleFeature(feature)}
                                            />
                                            <Label htmlFor={feature} className="text-sm">
                                                {feature}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                
                                {selectedFeatures.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {selectedFeatures.map(feature => (
                                            <Badge key={feature} variant="secondary">
                                                {feature}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleFeature(feature)}
                                                    className="ml-2 hover:text-red-500"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <Label htmlFor="video_url">Video URL (Optional)</Label>
                                <Input
                                    id="video_url"
                                    type="url"
                                    value={data.video_url}
                                    onChange={(e) => setData('video_url', e.target.value)}
                                    placeholder="https://youtube.com/watch?v=..."
                                />
                                {errors.video_url && <p className="text-red-500 text-sm mt-1">{errors.video_url}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Images *</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="images">Upload Images (Max 10)</Label>
                                <Input
                                    id="images"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="mt-2"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Upload high-quality images of your car. First image will be the primary image.
                                </p>
                                {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                            </div>
                            
                            {selectedImages.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {selectedImages.map((image, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                            {index === 0 && (
                                                <Badge className="absolute bottom-2 left-2 bg-blue-500">
                                                    Primary
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex items-center justify-end space-x-4">
                        <Link href={route('seller.cars.index')}>
                            <Button variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Car Listing'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
