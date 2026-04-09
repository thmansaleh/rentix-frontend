'use client';
import  { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Eye, EyeOff, Lock, User, Loader2, Building2, AlertCircle, Languages } from 'lucide-react';
import { appConfig } from '@/lib/appConfig';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';

// shadcn/ui components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { loginWithRedux } from '../services/api/auth';
import { selectAuthLoading, selectAuthError, clearError } from '@/redux/slices/authSlice';
import Image from 'next/image';
import api from '../services/api/axiosInstance';

export default function Page() {
  const dispatch = useDispatch();
  const authLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  const { language, switchLanguage, getLanguageLabel } = useLanguage();
  const { t } = useTranslations();

  const isRtl = language === 'ar';
  const dir = isRtl ? 'rtl' : 'ltr';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    branch_id: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(true);

  // Fetch branches for this tenant on mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setBranchesLoading(true);
        const response = await api.get('/auth/branches');
        const branchList = response.data?.data || response.data || [];
        setBranches(branchList);
        // Auto-select the first branch by default
        if (branchList.length > 0) {
          setFormData(prev => ({ ...prev, branch_id: String(branchList[0].id) }));
        }
      } catch (error) {
        console.error('Failed to fetch branches:', error);
        setBranches([]);
      } finally {
        setBranchesLoading(false);
      }
    };
    fetchBranches();
  }, []);

  // Load saved username on mount (password is NEVER stored locally)
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedUsername');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = t('auth.usernameRequired');
    }
    
    if (!formData.password) {
      newErrors.password = t('auth.passwordRequired');
    } else if (formData.password.length < 3) {
      newErrors.password = t('auth.passwordMinLength');
    }

    if (!formData.branch_id) {
      newErrors.branch_id = t('auth.branchRequired');
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
      const result = await dispatch(loginWithRedux(formData.email, formData.password, formData.branch_id, rememberMe));
      
      if (result.success) {
        // Only save username (never password) for convenience
        if (rememberMe) {
          localStorage.setItem('rememberedUsername', formData.email);
        } else {
          localStorage.removeItem('rememberedUsername');
        }
      }
    } catch (err) {

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
    <div
      className="min-h-screen flex items-center justify-center px-4 w-full relative"
      style={{ backgroundImage: "url('/background.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'scroll' }}
      dir={dir}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Language Toggle — fixed top corner */}
      <button
        onClick={switchLanguage}
        className="absolute top-4 right-4 z-20 flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-all"
        type="button"
      >
        <Languages className="w-3.5 h-3.5" />
        {language === 'ar' ? 'English' : 'العربية'}
      </button>

      <div className="w-full max-w-md relative z-10">
        {/* Login Card */}
        <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="flex flex-col items-center gap-3 px-8 pt-10 pb-6">
            <div className="rounded-full bg-white/15 border border-white/30 p-4 shadow-lg">
              <Image
                height={56}
                width={56}
                src={appConfig.logo}
                alt="Logo"
                className="object-contain"
              />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white tracking-wide">
                {appConfig.name}
              </h1>
              <p className="text-white/60 text-sm mt-1">{t('auth.welcomeSubtitle')}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/15 mx-8" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
            {authError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-400/40 bg-red-500/20 px-4 py-3 text-sm text-red-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Username */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-white/90">
                {t('auth.usernameLabel')}
              </Label>
              <div className="relative">
                <span className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-white/50`}>
                  <User className="w-4 h-4" />
                </span>
                <Input
                  id="email"
                  name="email"
                  type="text"
                  placeholder={t('auth.usernamePlaceholder')}
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`h-11 ${isRtl ? 'pr-10' : 'pl-10'} text-white placeholder:text-white/40 bg-white/10 border-white/20 focus:border-white/60 focus:bg-white/15 transition-all rounded-lg ${errors.email ? 'border-red-400/70 bg-red-500/10' : ''}`}
                  disabled={authLoading}
                  dir={dir}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-300 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-white/90">
                {t('auth.passwordLabel')}
              </Label>
              <div className="relative">
                <span className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-white/50`}>
                  <Lock className="w-4 h-4" />
                </span>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.passwordPlaceholder')}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`h-11 ${isRtl ? 'pr-10 pl-10' : 'pl-10 pr-10'} text-white placeholder:text-white/40 bg-white/10 border-white/20 focus:border-white/60 focus:bg-white/15 transition-all rounded-lg ${errors.password ? 'border-red-400/70 bg-red-500/10' : ''}`}
                  disabled={authLoading}
                  dir={dir}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-white/50 hover:text-white/90 transition-colors`}
                  disabled={authLoading}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-300 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password}
                </p>
              )}
            </div>

            {/* Branch Selector */}
            <div className="space-y-1.5">
              <Label htmlFor="branch" className="text-sm font-medium text-white/90">
                {t('auth.branchLabel')}
              </Label>
              <div className="relative">
                <span className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-white/50 z-10 pointer-events-none`}>
                  <Building2 className="w-4 h-4" />
                </span>
                <Select
                  value={formData.branch_id}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, branch_id: value }));
                    if (errors.branch_id) {
                      setErrors(prev => ({ ...prev, branch_id: '' }));
                    }
                  }}
                  disabled={authLoading || branchesLoading}
                  dir={dir}
                >
                  <SelectTrigger
                    className={`h-11 w-full ${isRtl ? 'pr-10' : 'pl-10'} text-white bg-white/10 border-white/20 focus:border-white/60 hover:bg-white/15 transition-all rounded-lg ${errors.branch_id ? 'border-red-400/70 bg-red-500/10' : ''}`}
                  >
                    <SelectValue
                      placeholder={
                        branchesLoading
                          ? <span className="flex items-center gap-2 text-white/50"><Loader2 className="w-3 h-3 animate-spin" /> {t('auth.loadingBranches')}</span>
                          : <span className="text-white/40">{t('auth.branchPlaceholder')}</span>
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={String(branch.id)}>
                        {branch.name_ar || branch.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.branch_id && (
                <p className="text-xs text-red-300 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> {errors.branch_id}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
                className="border-white/40 data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-black"
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm text-white/70 cursor-pointer select-none hover:text-white transition-colors"
              >
                {t('auth.rememberMe')}
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold rounded-lg bg-white text-gray-900 hover:bg-white/90 active:scale-[0.98] transition-all shadow-lg mt-2"
              disabled={authLoading}
            >
              {authLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('auth.loggingIn')}
                </span>
              ) : (
                t('auth.loginButton')
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="border-t border-white/10 px-8 py-5 text-center space-y-0.5">
            <p className="text-white/60 text-xs font-medium">{appConfig.footerText[language] || appConfig.footerText.en}</p>
            <p className="text-white/40 text-xs">{appConfig.supportText[language] || appConfig.supportText.en}</p>
          </div>
        </div>
      </div>
    </div>
  );
}