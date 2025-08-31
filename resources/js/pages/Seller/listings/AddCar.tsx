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
import { 
    Car, 
    Upload,
    X,
    Plus,
    AlertCircle
} from 'lucide-react';

interface AddCarForm {
    brand: string;
    model: string;
    year: number | '';
    mileage: number | '';
    fuel_type: string;
    transmission: string;
    price: number | '';
    currency: string;
    location: string;
    city: string;
    state: string;
    country: string;
    description: string;
    features: string[];
    video_url: string;
    images: File[];
}

export default function AddCar() {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const { data, setData, post, processing, errors } = useForm<AddCarForm>({
        brand: '',
        model: '',
        year: '',
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
        images: [],
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + selectedImages.length > 10) {
            alert('Maximum 10 images allowed');
            return;
        }

        const newImages = [...selectedImages, ...files];
        setSelectedImages(newImages);
        setData('images', newImages);

        // Create previews
        const newPreviews = [...imagePreviews];
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                newPreviews.push(e.target?.result as string);
                setImagePreviews([...newPreviews]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setSelectedImages(newImages);
        setImagePreviews(newPreviews);
        setData('images', newImages);
    };

    const handleFeatureToggle = (feature: string) => {
        const newFeatures = data.features.includes(feature)
            ? data.features.filter(f => f !== feature)
            : [...data.features, feature];
        setData('features', newFeatures);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'images') {
                selectedImages.forEach((image, index) => {
                    formData.append(`images[${index}]`, image);
                });
            } else if (key === 'features') {
                formData.append('features', JSON.stringify(value));
            } else {
                formData.append(key, value as string);
            }
        });

        post(route('seller.listings.store'), {
            data: formData,
            forceFormData: true,
        });
    };

    const commonFeatures = [
        'Air Conditioning', 'Power Steering', 'Power Windows', 'ABS',
        'Airbags', 'Alloy Wheels', 'Bluetooth', 'GPS Navigation',
        'Reverse Camera', 'Sunroof', 'Leather Seats', 'Automatic Climate Control',
        'Cruise Control', 'Keyless Entry', 'Push Button Start', 'USB Charging'
    ];

    return (
        <AppLayout>
            <Head title="Add New Car" />
            
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Add New Car Listing</h1>
                    <p className="text-gray-600">Fill in the details to list your car for sale</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Car className="h-5 w-5 mr-2" />
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="brand">Brand *</Label>
                                    <Input
                                        id="brand"
                                        value={data.brand}
                                        onChange={(e) => setData('brand', e.target.value)}
                                        placeholder="e.g., Toyota"
                                        required
                                    />
                                    {errors.brand && <p className="text-sm text-red-600">{errors.brand}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="model">Model *</Label>
                                    <Input
                                        id="model"
                                        value={data.model}
                                        onChange={(e) => setData('model', e.target.value)}
                                        placeholder="e.g., Camry"
                                        required
                                    />
                                    {errors.model && <p className="text-sm text-red-600">{errors.model}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="year">Year *</Label>
                                    <Input
                                        id="year"
                                        type="number"
                                        value={data.year}
                                        onChange={(e) => setData('year', parseInt(e.target.value) || '')}
                                        placeholder="2020"
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        required
                                    />
                                    {errors.year && <p className="text-sm text-red-600">{errors.year}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="mileage">Mileage (km) *</Label>
                                    <Input
                                        id="mileage"
                                        type="number"
                                        value={data.mileage}
                                        onChange={(e) => setData('mileage', parseInt(e.target.value) || '')}
                                        placeholder="50000"
                                        min="0"
                                        required
                                    />
                                    {errors.mileage && <p className="text-sm text-red-600">{errors.mileage}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="fuel_type">Fuel Type *</Label>
                                    <Select value={data.fuel_type} onValueChange={(value) => setData('fuel_type', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select fuel type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="petrol">Petrol</SelectItem>
                                            <SelectItem value="diesel">Diesel</SelectItem>
                                            <SelectItem value="electric">Electric</SelectItem>
                                            <SelectItem value="hybrid">Hybrid</SelectItem>
                                            <SelectItem value="cng">CNG</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.fuel_type && <p className="text-sm text-red-600">{errors.fuel_type}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="transmission">Transmission *</Label>
                                    <Select value={data.transmission} onValueChange={(value) => setData('transmission', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select transmission" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="manual">Manual</SelectItem>
                                            <SelectItem value="automatic">Automatic</SelectItem>
                                            <SelectItem value="cvt">CVT</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.transmission && <p className="text-sm text-red-600">{errors.transmission}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing & Location */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing & Location</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="price">Price *</Label>
                                    <div className="flex">
                                        <Select value={data.currency} onValueChange={(value) => setData('currency', value)}>
                                            <SelectTrigger className="w-20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="INR">₹</SelectItem>
                                                <SelectItem value="USD">$</SelectItem>
                                                <SelectItem value="EUR">€</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={data.price}
                                            onChange={(e) => setData('price', parseFloat(e.target.value) || '')}
                                            placeholder="500000"
                                            min="0"
                                            className="flex-1 ml-2"
                                            required
                                        />
                                    </div>
                                    {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="location">Full Address *</Label>
                                    <Input
                                        id="location"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="Complete address"
                                        required
                                    />
                                    {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="city">City *</Label>
                                    <Input
                                        id="city"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        placeholder="Mumbai"
                                        required
                                    />
                                    {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="state">State *</Label>
                                    <Input
                                        id="state"
                                        value={data.state}
                                        onChange={(e) => setData('state', e.target.value)}
                                        placeholder="Maharashtra"
                                        required
                                    />
                                    {errors.state && <p className="text-sm text-red-600">{errors.state}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="country">Country *</Label>
                                    <Input
                                        id="country"
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                        placeholder="India"
                                        required
                                    />
                                    {errors.country && <p className="text-sm text-red-600">{errors.country}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button type="button" variant="outline">
                            Save as Draft
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Submitting...' : 'Submit for Approval'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
