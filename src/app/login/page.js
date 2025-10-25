'use client';
import  { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Eye, EyeOff, Lock, User, Loader2, Scale } from 'lucide-react';

// shadcn/ui components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { loginWithRedux } from '../services/api/auth';
import { selectAuthLoading, selectAuthError, clearError } from '@/redux/slices/authSlice';
import Image from 'next/image';

export default function Page() {
  const dispatch = useDispatch();
  const authLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      setFormData({
        email: savedEmail,
        password: savedPassword
      });
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'اسم المستخدم مطلوب';
    }
    
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 3) {
      newErrors.password = 'يجب أن تكون كلمة المرور 3 أحرف على الأقل';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any previous errors
    if (authError) {
      dispatch(clearError());
    }
    
    if (!validateForm()) return;
    
    try {
      const result = await dispatch(loginWithRedux(formData.email, formData.password));
      
      if (result.success) {
        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
          localStorage.setItem('rememberedPassword', formData.password);
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-cover bg-center bg-no-repeat bg-fixed w-full" style={{ backgroundImage: "url('/background.jpg')", backgroundSize: 'cover' }} dir="rtl">
      <div className="w-full max-w-md mx-auto">
       

        {/* Login Card */}
        <Card className="shadow-lg bg-white/10 backdrop-blur-sm">
        <CardHeader className="flex items-center flex-col ">
             <div className="mx-auto  ">
            <Image height='60' width='60' src="/log_in_card_logo.png" alt="Law Office Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-1">
            LEXORA
          </h1>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {authError && (
                  <Alert variant="destructive">
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-white">
                    اسم المستخدم
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="text"
                    placeholder="أدخل اسم المستخدم"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`h-11 ${errors.email ? 'border-red-500' : ''}`}
                    disabled={authLoading}
                    dir="rtl"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-white">
                    كلمة المرور
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="أدخل كلمة المرور"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`h-11 pl-10 ${errors.password ? 'border-red-500' : ''}`}
                      disabled={authLoading}
                      dir="rtl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white "
                      disabled={authLoading}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id="rememberMe" 
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                  />
                  <Label 
                    htmlFor="rememberMe" 
                    className="text-sm mx-2 text-white cursor-pointer select-none"
                  >
                    تذكرني
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={authLoading}
                >
                  {authLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      جاري تسجيل الدخول...
                    </>
                  ) : (
                    'تسجيل الدخول'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
          <p className="text-white text-xs">
           نظام LEXORA لإدارة مكاتب المحاماة
          </p>

          </CardFooter>
        </Card>

   
      </div>
    </div>
  );
}