'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { User, Bell, CreditCard, Key, Shield, LogOut } from 'lucide-react';
import { useUser } from '@/app/context/UserContext';
import { useUpgradePopup } from '@/app/dashboard/layout';
import withAuth from '@/components/auth/withAuth';

function AccountSettings() {
  const { user, userTier, signOut } = useUser();
  const { setShowUpgradePopup } = useUpgradePopup();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailUpdates: true,
    productNews: true,
    securityAlerts: true,
  });
  
  useEffect(() => {
    // If user data is loaded, populate the form
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.displayName || '',
        email: user.email || '',
      }));
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement profile update logic here
    alert('Profile updated successfully!');
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement password change logic here
    
    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    // Reset password fields after submission
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    
    alert('Password changed successfully!');
  };
  
  const handleNotificationSave = () => {
    // Save notification preferences
    alert('Notification preferences saved');
  };

  return (
    <div className="max-w-6xl mx-auto pt-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-2">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        Account Settings
      </h1>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-gradient-to-r from-blue-600 to-purple-600 p-1 rounded-lg">
          <TabsTrigger value="profile" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-blue-600">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-blue-600">
            <CreditCard className="h-4 w-4" />
            Subscription
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-blue-600">
            <Key className="h-4 w-4" />
            Password
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-blue-600">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="border-blue-100 shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
              <CardTitle className="flex items-center text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your account details and profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Full Name
                    </Label>
                    <Input 
                      id="fullName" 
                      name="fullName" 
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      Email Address
                    </Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      disabled
                      className="border-blue-200 bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">Email address cannot be changed</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                      <polyline points="17 21 17 13 7 13 7 21"></polyline>
                      <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Account Deletion */}
          <Card className="mt-6 border-red-200 shadow-md">
            <CardHeader className="bg-red-50 rounded-t-lg">
              <CardTitle className="text-red-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                Danger Zone
              </CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-red-500">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                    Delete Account
                  </h4>
                  <p className="text-sm text-gray-500 ml-6">
                    Once deleted, all your data will be permanently removed
                  </p>
                </div>
                <Button variant="destructive" className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Subscription Tab */}
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>
                Manage your subscription and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Current Plan */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Current Plan</h3>
                    <Badge variant={userTier === 'pro' ? 'default' : 'outline'}>
                      {userTier === 'pro' ? 'Pro' : 'Free'}
                    </Badge>
                  </div>
                  
                  {userTier === 'pro' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Billing Period</p>
                          <p className="font-medium">Monthly</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Next Payment</p>
                          <p className="font-medium">June 15, 2023</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Amount</p>
                          <p className="font-medium">$9.99/month</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Payment Method</p>
                          <p className="font-medium flex items-center">
                            <CreditCard className="h-4 w-4 mr-1" /> •••• 4242
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button variant="outline" size="sm">
                          Update Payment Method
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                          Cancel Subscription
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        You're currently on the free plan with limited features.
                        Upgrade to Pro to unlock all features.
                      </p>
                      
                      <ul className="space-y-2 pl-5 text-sm">
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>40 AI generations per week</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>Advanced Deep Research function</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>Priority support</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>Early access to new features</span>
                        </li>
                      </ul>
                      
                      <Button onClick={() => setShowUpgradePopup(true)}>
                        Upgrade to Pro
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Billing History */}
                {userTier === 'pro' && (
                  <div>
                    <h3 className="font-medium mb-3">Billing History</h3>
                    
                    <div className="bg-white border rounded-lg divide-y">
                      {['May 15, 2023', 'April 15, 2023', 'March 15, 2023'].map((date, index) => (
                        <div key={index} className="flex items-center justify-between p-3">
                          <div>
                            <p className="font-medium">Monthly Subscription</p>
                            <p className="text-sm text-gray-500">{date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">$9.99</p>
                            <Button variant="link" size="sm" className="h-auto p-0">
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Password Tab */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      name="currentPassword" 
                      type="password" 
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      name="newPassword" 
                      type="password" 
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Password must be at least 8 characters long with at least one uppercase letter, 
                      one lowercase letter, one number, and one special character.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      type="password" 
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">Update Password</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Security Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Additional security features to protect your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <Badge className="ml-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Coming Soon</Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch disabled />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <h4 className="font-medium">Login Notifications</h4>
                    </div>
                    <p className="text-sm text-gray-500">
                      Receive an email when a new device logs into your account
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.securityAlerts}
                    onCheckedChange={() => handleNotificationToggle('securityAlerts')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Email Updates</h4>
                      <p className="text-sm text-gray-500">
                        Receive email notifications about your account activity
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.emailUpdates}
                      onCheckedChange={() => handleNotificationToggle('emailUpdates')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Product News</h4>
                      <p className="text-sm text-gray-500">
                        Get notified about new features and improvements
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.productNews}
                      onCheckedChange={() => handleNotificationToggle('productNews')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Security Alerts</h4>
                      <p className="text-sm text-gray-500">
                        Get notified about important security updates
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.securityAlerts}
                      onCheckedChange={() => handleNotificationToggle('securityAlerts')}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleNotificationSave}>Save Preferences</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Log Out Button */}
      <div className="mt-8 text-center">
        <Button 
          variant="outline" 
          className="text-gray-700" 
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  );
}

export default withAuth(AccountSettings); 