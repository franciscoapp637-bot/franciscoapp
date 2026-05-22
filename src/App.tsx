import React, { useState, useEffect } from 'react';
import { FileText, Wrench, LogOut, Download, Share2, X, Eye, EyeOff, Settings, Lock } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Certificate } from './types';
import { generateCertificatePDF } from './utils/pdfGenerator';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Hardcoded credentials for proxy authentication
  const USERNAME = 'Francisco';
  const defaultPassword = 'Franciscoaragão637';

  useEffect(() => {
    const localAuth = localStorage.getItem('francisco_auth');
    if (localAuth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userStr = String(formData.get('username') || '').trim();
    const passStr = String(formData.get('password') || '').trim();

    const savedPassword = localStorage.getItem('francisco_password') || defaultPassword;

    if (userStr.toLowerCase() === USERNAME.toLowerCase() && passStr === savedPassword) {
      if (rememberMe) {
        localStorage.setItem('francisco_auth', 'true');
      }
      setIsAuthenticated(true);
    } else {
      alert('Credenciais inválidas! Verifique se digitou a senha corretamente.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('francisco_auth');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-zinc-950">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
        ></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/85 to-zinc-950/95 backdrop-blur-[2px]"></div>

        <div className="relative z-10 w-full max-w-md p-4">
          <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-zinc-800/60 ring-1 ring-white/10">
            <div className="p-8 sm:p-10">
              <div className="flex flex-col items-center mb-10">
                <div className="bg-gradient-to-br from-red-600 to-red-800 p-4 rounded-full mb-6 shadow-[0_0_30px_rgba(220,38,38,0.3)] ring-1 ring-red-500/50">
                  <Wrench className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-extrabold text-white tracking-tighter text-center uppercase">
                  Francisco <span className="text-red-600">Mecânico</span>
                </h1>
                <p className="text-zinc-400 mt-2 font-bold text-xs tracking-[0.25em] uppercase">
                  Oficina Premium
                </p>
              </div>
              
              <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-2 uppercase tracking-widest pl-1">ID do Usuário</label>
                    <div className="relative">
                      <input 
                        name="username" 
                        type="text" 
                        defaultValue="Francisco" 
                        className="block w-full rounded-xl border border-zinc-800 bg-zinc-950/50 text-white placeholder-zinc-600 shadow-inner focus:border-red-500 focus:bg-zinc-900/80 focus:ring-1 focus:ring-red-500 transition-all p-4 outline-none" 
                        required 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-2 uppercase tracking-widest pl-1">Senha de Acesso</label>
                    <div className="relative">
                      <input 
                        name="password" 
                        type={showPassword ? 'text' : 'password'} 
                        className="block w-full rounded-xl border border-zinc-800 bg-zinc-950/50 text-white placeholder-zinc-600 shadow-inner focus:border-red-500 focus:bg-zinc-900/80 focus:ring-1 focus:ring-red-500 transition-all p-4 pr-14 outline-none" 
                        required 
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-500 hover:text-red-500 transition-colors">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pl-1">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-500 focus:ring-offset-zinc-900 transition-colors cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-[10px] text-zinc-400 uppercase tracking-widest font-bold cursor-pointer transition-colors hover:text-red-400 mt-1">
                      Lembrar meu acesso
                    </label>
                  </div>
                </div>

                <button type="submit" className="w-full flex justify-center py-4 px-4 mt-8 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.2)] text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 border border-red-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-red-500 transition-all active:scale-[0.98] uppercase tracking-widest">
                  Acessar Oficina
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans pb-10 selection:bg-red-500/30">
      <header className="bg-white sticky top-0 z-50 border-b border-zinc-200/80 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-red-600 to-red-800 p-2.5 rounded-xl shadow-md ring-1 ring-red-500/20">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight leading-none uppercase">Francisco <span className="text-red-600">Mecânico</span></h1>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mt-0.5">Oficina Premium</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setShowSettings(true)} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-2.5 rounded-xl transition-all" title="Configurações (Alterar Senha)">
              <Settings className="w-5 h-5" />
            </button>
            <button onClick={handleLogout} className="text-zinc-400 hover:text-red-600 hover:bg-red-50 p-2.5 rounded-xl transition-all" title="Sair do Sistema">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CertificateForm />
      </main>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} defaultPassword={defaultPassword} />}
    </div>
  );
}

function SettingsModal({ onClose, defaultPassword }: { onClose: () => void, defaultPassword: string }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const savedPassword = localStorage.getItem('francisco_password') || defaultPassword;
    
    if (currentPassword !== savedPassword) {
      alert('A senha atual está incorreta!');
      return;
    }
    
    if (newPassword.trim().length < 4) {
      alert('A nova senha deve ter pelo menos 4 caracteres.');
      return;
    }
    
    localStorage.setItem('francisco_password', newPassword.trim());
    alert('Senha alterada com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="bg-zinc-200 p-2 rounded-full">
                <Lock className="w-5 h-5 text-zinc-700" />
             </div>
             <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Alterar Senha</h3>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5 uppercase tracking-wide">Senha Atual</label>
            <div className="relative">
              <input 
                type={showCurrent ? 'text' : 'password'} 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 pr-12 text-zinc-900 focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 transition-colors shadow-sm" 
                required 
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400 hover:text-zinc-600 transition-colors">
                {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5 uppercase tracking-wide">Nova Senha</label>
            <div className="relative">
              <input 
                type={showNew ? 'text' : 'password'} 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 pr-12 text-zinc-900 focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 transition-colors shadow-sm" 
                required 
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400 hover:text-zinc-600 transition-colors">
                {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full flex justify-center py-3 px-4 mt-2 rounded-xl shadow-md text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-all active:scale-[0.98] uppercase tracking-wider">
            Salvar Nova Senha
          </button>
        </form>
      </div>
    </div>
  );
}

function CertificateForm() {
  const { register, handleSubmit, control, watch, reset } = useForm<Certificate>({
    defaultValues: {
      clientName: '',
      motoModel: '',
      motoPlate: '',
      motoMileage: '',
      services: [{ description: '', laborCost: 0, partsCost: 0 }],
      observations: '',
      photoUrls: []
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "services" });
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = watch('services') || [];
  const laborTotal = services.reduce((sum, s) => sum + (Number(s.laborCost) || 0), 0);
  const partsTotal = services.reduce((sum, s) => sum + (Number(s.partsCost) || 0), 0);
  const total = laborTotal + partsTotal;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
            setPhotos(prev => [...prev, dataUrl]);
          };
          img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const generateData = (data: Certificate): Certificate => {
    const certNumber = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
    // valid services
    const validServices = data.services?.filter(s => s.description.trim() !== '') || [];
    const laborVal = validServices.reduce((sum, s) => sum + (Number(s.laborCost) || 0), 0);
    const partsVal = validServices.reduce((sum, s) => sum + (Number(s.partsCost) || 0), 0);

    return {
      ...data,
      certificateNumber: certNumber,
      totalValue: laborVal + partsVal,
      laborValue: laborVal,
      partsValue: partsVal,
      photoUrls: photos,
      createdAt: new Date().toISOString(),
      userId: 'local-user',
      services: validServices
    };
  };

  const handleGenerateAndShare = handleSubmit(async (data: Certificate) => {
    setIsSubmitting(true);
    try {
      const certData = generateData(data);
      const pdfBlob = await generateCertificatePDF(certData);
      const file = new File([pdfBlob], `Certificado-${certData.certificateNumber}.pdf`, { type: 'application/pdf' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `Certificado ${certData.certificateNumber}`,
            text: `Olá ${certData.clientName}! Segue o certificado de serviço da sua ${certData.motoModel}.`
          });
          // Optional: clear form after sharing
          reset();
          setPhotos([]);
        } catch (err: any) {
          if (err.name !== 'AbortError') {
            console.error("Share failed", err);
            handleFallbackDownload(pdfBlob, certData.certificateNumber);
          }
        }
      } else {
        handleFallbackDownload(pdfBlob, certData.certificateNumber);
      }
    } catch (e) {
      console.error(e);
      alert('Erro ao gerar o PDF. Verifique os dados inseridos.');
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleGenerateAndDownload = handleSubmit(async (data: Certificate) => {
    setIsSubmitting(true);
    try {
      const certData = generateData(data);
      const pdfBlob = await generateCertificatePDF(certData);
      handleFallbackDownload(pdfBlob, certData.certificateNumber);
      reset();
      setPhotos([]);
    } catch (e) {
      console.error(e);
      alert('Erro ao gerar o PDF. Verifique os dados inseridos.');
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleFallbackDownload = (pdfBlob: Blob, certNumber: string) => {
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificado-${certNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200/60 overflow-hidden">
      <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center">
        <FileText className="w-5 h-5 text-red-600 mr-3" />
        <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Emitir Novo Certificado</h3>
      </div>
      
      <div className="p-6 sm:p-8 space-y-8 animate-in fade-in duration-500">
        <section>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">1. Dados do Cliente e Veículo</h4>
          <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2 md:grid-cols-3">
            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Nome do Cliente</label>
              <input type="text" {...register('clientName')} required className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-zinc-900 focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 transition-colors shadow-sm" placeholder="Nome completo" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Motocicleta</label>
              <input type="text" {...register('motoModel')} required className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-zinc-900 focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 transition-colors shadow-sm" placeholder="Modelo e ano" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Placa</label>
              <input type="text" {...register('motoPlate')} className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-zinc-900 focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 transition-colors shadow-sm uppercase placeholder:normal-case" placeholder="ABC-1234" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Quilometragem</label>
              <input type="text" {...register('motoMileage')} className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-zinc-900 focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 transition-colors shadow-sm" placeholder="Ex: 15.000" />
            </div>
          </div>
        </section>

        <section>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">2. Serviços Detalhados</h4>
          <div className="space-y-4">
            {fields.map((item, index) => (
              <div key={item.id} className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 shadow-sm relative group">
                <div className="absolute -top-3 -right-3">
                  <button type="button" onClick={() => remove(index)} className="p-2 bg-white text-zinc-400 shadow-sm hover:text-red-600 hover:bg-red-50 rounded-full transition-all ring-1 ring-zinc-200" title="Remover Serviço">
                    <X className="w-4 h-4"/>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 mb-1">Descrição</label>
                    <input type="text" {...register(`services.${index}.description`)} required className="block w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-sm text-zinc-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors" placeholder="Ex: Troca de óleo do motor" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 mb-1">Mão de Obra (R$)</label>
                      <input type="number" step="0.01" {...register(`services.${index}.laborCost`)} className="block w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-sm text-zinc-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors" placeholder="0.00" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 mb-1">Peças (R$)</label>
                      <input type="number" step="0.01" {...register(`services.${index}.partsCost`)} className="block w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-sm text-zinc-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors" placeholder="0.00" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => append({ description: '', laborCost: 0, partsCost: 0 })} className="mt-4 text-sm tracking-wide text-red-600 font-bold hover:text-red-700 px-4 py-3 bg-red-50/50 hover:bg-red-50 rounded-xl transition-colors border border-red-100/50 hover:border-red-200 w-full flex items-center justify-center gap-2">
            <Wrench className="w-4 h-4" /> Adicionar Mais um Serviço
          </button>
        </section>

        <section>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">3. Resumo Financeiro</h4>
          <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2">
            <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-xl flex justify-between items-center">
               <span className="text-sm font-medium text-zinc-500">Mão de Obra:</span>
               <span className="text-lg font-bold text-zinc-800">R$ {laborTotal.toFixed(2)}</span>
            </div>
            <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-xl flex justify-between items-center">
               <span className="text-sm font-medium text-zinc-500">Peças:</span>
               <span className="text-lg font-bold text-zinc-800">R$ {partsTotal.toFixed(2)}</span>
            </div>
            <div className="sm:col-span-2 mt-2">
              <div className="flex items-center justify-between text-lg font-bold text-zinc-900 bg-red-50/50 border border-red-100 p-5 rounded-2xl">
                <span className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Total Geral</span>
                <span className="text-3xl text-red-600">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">4. Fotos Anexas (Opcional)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo, i) => (
              <div key={i} className="relative aspect-square bg-zinc-100 rounded-xl overflow-hidden shadow-sm group ring-1 ring-zinc-200">
                <img src={photo} alt="" className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500" />
                <button type="button" onClick={() => removePhoto(i)} className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full p-2 text-zinc-500 shadow-sm cursor-pointer hover:text-red-600 hover:bg-white transition-colors">
                  <X className="w-4 h-4"/>
                </button>
              </div>
            ))}
            <label className="aspect-square bg-zinc-50 border-2 border-dashed border-zinc-300 hover:border-red-400 hover:bg-red-50/30 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group">
              <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform mb-2 text-red-500">
                <Wrench className="w-5 h-5"/>
              </div>
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider group-hover:text-red-600">Adicionar</span>
              <input type="file" multiple accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>
        </section>

        <section>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">5. Observações Finais</h4>
          <div>
            <textarea {...register('observations')} rows={2} className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-zinc-900 focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 transition-colors shadow-sm resize-none" placeholder="Condições de garantia, recomendações futuras, etc..."></textarea>
          </div>
        </section>

        <div className="pt-8 border-t border-zinc-100 mt-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <button type="button" onClick={handleGenerateAndDownload} disabled={isSubmitting} className="flex-1 flex justify-center items-center gap-2 py-4 px-4 border border-zinc-200 rounded-xl shadow-sm text-sm font-bold text-zinc-700 bg-white hover:bg-zinc-50 hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-all active:scale-[0.98]">
              <Download className="w-5 h-5"/>
              {isSubmitting ? 'Gerando...' : 'Apenas Baixar PDF'}
            </button>
            <button type="button" onClick={handleGenerateAndShare} disabled={isSubmitting} className="flex-[2] flex justify-center items-center gap-2 py-4 px-4 border border-transparent shadow-lg shadow-red-600/20 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all active:scale-[0.98] uppercase tracking-wider">
              <Share2 className="w-5 h-5"/>
              {isSubmitting ? 'Gerando PDF...' : 'Gerar e Compartilhar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
