<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\SellerProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show()
    {
        $user = auth()->user();
        $profile = $user->sellerProfile;

        return Inertia::render('Seller/Profile/Show', [
            'user' => $user,
            'profile' => $profile,
        ]);
    }

    public function edit()
    {
        $user = auth()->user();
        $profile = $user->sellerProfile;

        return Inertia::render('Seller/Profile/Edit', [
            'user' => $user,
            'profile' => $profile,
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        // Validate user data
        $userValidated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Validate profile data
        $profileValidated = $request->validate([
            'business_name' => 'nullable|string|max:255',
            'business_type' => 'required|in:individual,dealer,showroom',
            'business_address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'required|string|max:255',
            'business_phone' => 'nullable|string|max:20',
            'business_email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'description' => 'nullable|string',
            'license_number' => 'nullable|string|max:255',
            'registration_document' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar
            if ($user->avatar) {
                $oldPath = str_replace('/storage/', '', parse_url($user->avatar, PHP_URL_PATH));
                Storage::disk('public')->delete($oldPath);
            }
            
            $path = $request->file('avatar')->store('avatars', 'public');
            $userValidated['avatar'] = Storage::url($path);
        }

        // Update user
        $user->update($userValidated);

        // Handle profile image upload
        if ($request->hasFile('profile_image')) {
            $path = $request->file('profile_image')->store('profiles', 'public');
            $profileValidated['profile_image'] = Storage::url($path);
        }

        // Handle registration document upload
        if ($request->hasFile('registration_document')) {
            $path = $request->file('registration_document')->store('documents', 'public');
            $profileValidated['registration_document'] = Storage::url($path);
        }

        // Create or update seller profile
        if ($user->sellerProfile) {
            $user->sellerProfile->update($profileValidated);
        } else {
            $profileValidated['user_id'] = $user->id;
            SellerProfile::create($profileValidated);
        }

        return redirect()->route('seller.profile.show')
            ->with('success', 'Profile updated successfully!');
    }
}
