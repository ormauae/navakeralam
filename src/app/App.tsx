import { useState } from 'react';
import { Share2, Download, Search, CheckCircle2, Building2, X, ExternalLink, Play } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

interface Achievement {
  id: string;
  title: string;
  description: string;
  tags: string[];
  icon: string;
  highlighted?: boolean;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  detailedReport?: {
    fullDescription: string;
    statistics: { label: string; value: string }[];
    links: { label: string; url: string }[];
    additionalInfo: string[];
  };
}

interface Department {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
  achievements: Achievement[];
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('എല്ലാം (All)');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const categories = [
    { id: 'all', label: 'എല്ലാം (All)', icon: '📋' },
    { id: 'health', label: '🏥 ആരോഗ്യ വകുപ്പ്', icon: '🏥' },
    { id: 'education', label: '🎓 സാമൂഹ്യ വകുപ്പ്', icon: '🎓' },
    { id: 'welfare', label: '🏛️ ക്ഷേമ വകുപ്പ്', icon: '🏛️' },
    { id: 'finance', label: '💰 പേയ്മെന്റ്സ് വകുപ്പ്', icon: '💰' },
    { id: 'other', label: '⚡ കോൺഫിൽ വകുപ്പ്', icon: '⚡' },
    { id: 'agriculture', label: '🌾 ആരോഗ്യ വകുപ്പ്', icon: '🌾' },
  ];

  const stats = [
    { label: 'വകുപ്പുകൾ', value: '6', color: 'from-emerald-500 to-emerald-600' },
    { label: 'നേട്ടങ്ങൾ', value: '80+', color: 'from-blue-500 to-blue-600' },
    { label: 'വിവേദ്യന്ന്', value: '₹5,000Cr+', color: 'from-orange-500 to-orange-600' },
    { label: 'സാമന്തു ചിലേഷ്മു', value: '₹7,708Cr', color: 'from-purple-500 to-purple-600' },
    { label: 'ദേശീയ പുനസ്ഥാപനങ്ങൾ', value: '32', color: 'from-pink-500 to-pink-600' },
    { label: 'തൊഴിലാസനങ്ങൾ', value: '5L+', color: 'from-teal-500 to-teal-600' },
  ];

  const departments: Department[] = [
    {
      id: 'health',
      name: 'ആരോഗ്യ വകുപ്പ്',
      icon: '🏥',
      count: 14,
      color: 'from-red-500 to-pink-500',
      achievements: [
        {
          id: '1',
          title: 'പുതിയ മെഡിക്കൽ കോളേജുകൾ',
          description: 'പത്തനംതിട്ട, ഇടുക്കി, വയനാട്, കാസർഗോഡ് എന്നീ ജില്ലകളിൽ പുതിയ മെഡിക്കൽ കോളേജുകൾ സ്ഥാപിച്ചു',
          tags: ['വിവരുദ്യന്ന്', 'ആരോഗ്യം'],
          icon: '🏥',
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1683792337566-e305745c15ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3NwaXRhbCUyMG1lZGljYWwlMjBjb2xsZWdlJTIwaW5kaWF8ZW58MXx8fHwxNzcyMTIwNTE3fDA&ixlib=rb-4.1.0&q=80&w=1080',
          detailedReport: {
            fullDescription: 'കേരളത്തിലെ എല്ലാ ജില്ലകളിൽ മെഡിക്കൽ കോളേജ് സൗകര്യം ലഭ്യമാക്കുക എന്ന ലക്ഷ്യത്തോടെ പത്തനംതിട്ട, ഇടുക്കി, വയനാട്, കാസർഗോഡ് എന്നീ ജില്ലകളിൽ നാല് പുതിയ മെഡിക്കൽ കോളേജുകൾ സ്ഥാപിച്ചു. ഓരോ കോളേജിലും 100 MBBS സീറ്റുകൾ ലഭ്യമാണ്. അത്യാധുനിക അടിസ്ഥാന സൗകര്യങ്ങളും അനുബന്ധ ആശുപത്രികളും സജ്ജമാക്കിയിട്ടുണ്ട്.',
            statistics: [
              { label: 'പുതിയ കോളേജുകൾ', value: '4' },
              { label: 'MBBS സീറ്റുകൾ', value: '400' },
              { label: 'നിക്ഷേപം', value: '₹1,200 കോടി' },
              { label: 'തൊഴിലവസരങ്ങൾ', value: '2,000+' },
            ],
            links: [
              { label: 'ആരോഗ്യ വകുപ്പ് വെബ്സൈറ്റ്', url: 'https://dhs.kerala.gov.in' },
              { label: 'അപേക്ഷ സമർപ്പിക്കുക', url: '#' },
              { label: 'പൂർണ്ണ റിപ്പോർട്ട് PDF', url: '#' },
            ],
            additionalInfo: [
              'എല്ലാ കോളേജുകളിലും അത്യാധുനിക ലബോറട്ടറികളും സിമുലേഷൻ സെന്ററുകളും ഉണ്ട്',
              'പ്രാദേശിക ജനങ്ങൾക്ക് മെഡിക്കൽ വിദ്യാഭ്യാസത്തിന് കൂടുതൽ അവസരങ്ങൾ',
              'സംസ്ഥാനത്തെ മെഡിക്കൽ വിദ്യാഭ്യാസത്തിന്റെ നിലവാരം ഉയർത്തുന്നു',
              'അനുബന്ധ ആശുപത്രികളിലൂടെ പ്രാദേശിക ആരോഗ്യ സേവനം മെച്ചപ്പെടുത്തുന്നു',
            ],
          },
        },
        {
          id: '2',
          title: '21 നഴ്സിംഗ് കോളേജുകൾ',
          description: 'സർക്കാർ/അനുബന്ധ മേഖലയിൽ 21 നഴ്സിംഗ് കോളേജുകൾ സ്ഥാപിച്ചു',
          tags: ['വിവരുദ്യന്ന്'],
          icon: '🏥',
          highlighted: true,
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzaW5nJTIwY29sbGVnZSUyMHN0dWRlbnRzJTIwaGVhbHRoY2FyZSUyMHRyYWluaW5nfGVufDF8fHx8MTc3MjEyNTc3NXww&ixlib=rb-4.1.0&q=80&w=1080',
          detailedReport: {
            fullDescription: 'കേരളത്തിൽ നഴ്സിംഗ് വിദ്യാഭ്യാസത്തിന് കൂടുതൽ അവസരങ്ങൾ സൃഷ്ടിക്കുന്നതിനായി 21 പുതിയ നഴ്സിംഗ് കോളേജുകൾ സ്ഥാപിച്ചു. BSc നഴ്സിംഗ് സീറ്റുകൾ 478-ൽ നിന്ന് 1,060 ആയി വർധിപ്പിച്ചു. സ്ത്രീകൾക്ക് കൂടുതൽ തൊഴിലവസരങ്ങൾ സൃഷ്ടിക്കുന്നതിനും ആരോഗ്യ മേഖലയിൽ കാര്യക്ഷമത വർധിപ്പിക്കുന്നതിനും ഈ സംരംഭം സഹായകമായി.',
            statistics: [
              { label: 'പുതിയ കോളേജുകൾ', value: '21' },
              { label: 'BSc നഴ്സിംഗ് സീറ്റുകൾ', value: '1,060' },
              { label: 'വാർഷിക വിദ്യാർത്ഥികൾ', value: '3,180' },
              { label: 'തൊഴിലവസരങ്ങൾ', value: '1,500+' },
            ],
            links: [
              { label: 'നഴ്സിംഗ് കൗൺസിൽ വെബ്സൈറ്റ്', url: '#' },
              { label: 'പ്രവേശന വിവരങ്ങൾ', url: '#' },
            ],
            additionalInfo: [
              'സർക്കാർ, സ്വയംഭരണ സ്ഥാപനങ്ങളിൽ തുല്യ അവസരം',
              'കുറഞ്ഞ ഫീസ് ഘടനയിൽ ഗുണമേന്മയുള്ള വിദ്യാഭ്യാസം',
              'ആധുനിക പരിശീലന സൗകര്യങ്ങൾ',
            ],
          },
        },
        {
          id: '3',
          title: 'ശിശുമരണ നിരക്ക് - വികസിത രാജ്യങ്ങളെക്കാൾ മികച്ചത്',
          description: 'കേരളത്തിലെ ശിശുമരണ നിരക്ക് (5) യുഎസിനേക്കാൾ കുറവ്',
          tags: ['ആരോഗ്യം', 'ദേശീയ അംഗീകാരം'],
          icon: '🏥',
          mediaType: 'video',
          mediaUrl: 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg',
        },
        {
          id: '4',
          title: 'സൗജന്യ ചികിത്സ - കർധക പദ്ധതി',
          description: '₹7,708 കോടി രൂപയുടെ സൗജന്യ ചികിത്സ നൽകി',
          tags: ['ആരോഗ്യം'],
          icon: '🏥',
          detailedReport: {
            fullDescription: 'കേരള സർക്കാരിന്റെ കർധക പദ്ധതിയിലൂടെ ദരിദ്രരായ രോഗികൾക്ക് സൗജന്യ വൈദ്യ ചികിത്സ നൽകുന്നു. സർക്കാർ, സ്വകാര്യ ആശുപത്രികളിൽ നിന്നും ഉയർന്ന നിലവാരമുള്ള ചികിത്സ ലഭിക്കുന്നു. ഇതുവരെ ₹7,708 കോടി രൂപയുടെ സൗജന്യ ചികിത്സ നൽകിയിട്ടുണ്ട്.',
            statistics: [
              { label: 'മൊത്തം തുക', value: '₹7,708 കോടി' },
              { label: 'പ്രയോജനം നേടിയവർ', value: '25 ലക്ഷം+' },
              { label: 'ആശുപത്രികൾ', value: '850+' },
              { label: 'ചികിത്സകൾ', value: '50 ലക്ഷം+' },
            ],
            links: [
              { label: 'കർധക പോർട്ടൽ', url: '#' },
              { label: 'അപേക്ഷ സമർപ്പിക്കുക', url: '#' },
            ],
            additionalInfo: [
              'കാൻസർ, ഹൃദ്രോഗം, വൃക്ക രോഗങ്ങൾക്ക് സൗജന്യ ചികിത്സ',
              'സർക്കാർ, എംപാനൽഡ് സ്വകാര്യ ആശുപത്രികളിൽ',
              'ദരിദ്രരായ എല്ലാ കുടുംബങ്ങൾക്കും ലഭ്യം',
            ],
          },
        },
        {
          id: '5',
          title: 'സൗജന്യ മരുന്നുകൾ',
          description: 'KSSSCL വഴി ₹3,300+ കോടി രൂപയുടെ സൗജന്യ മരുന്നുകൾ',
          tags: ['ആരോഗ്യം'],
          icon: '🏥',
        },
        {
          id: '6',
          title: 'ജനക്കിയ ആരോഗ്യ കേന്ദ്രങ്ങൾ',
          description: 'സംസ്ഥാനത്തുടനീളം 5,415 കേന്ദ്രങ്ങൾ പ്രവർത്തിക്കുന്നു',
          tags: ['ആരോഗ്യം'],
          icon: '🏥',
        },
      ]
    },
    {
      id: 'education',
      name: 'വിദ്യാഭ്യാസ വകുപ്പ്',
      icon: '🎓',
      count: 12,
      color: 'from-blue-500 to-indigo-500',
      achievements: [
        {
          id: 'e1',
          title: 'സ്മാർട്ട് ക്ലാസ്‌റൂമുകൾ',
          description: 'സംസ്ഥാനത്തെ 15,000+ സർക്കാർ സ്കൂളുകളിൽ സ്മാർട്ട് ക്ലാസ്‌റൂമുകൾ',
          tags: ['ഡിജിറ്റൽ', 'വിദ്യാഭ്യാസം'],
          icon: '🎓',
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1758270704534-fd9715bffc0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGNsYXNzcm9vbSUyMGRpZ2l0YWwlMjBlZHVjYXRpb258ZW58MXx8fHwxNzcyMTIwNTE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
          detailedReport: {
            fullDescription: 'കേരളത്തിലെ സർക്കാർ സ്കൂളുകളിൽ വിദ്യാഭ്യാസത്തിന്റെ നിലവാരം ഉയർത്തുന്നതിനായി 15,000-ലധികം സ്മാർട്ട് ക്ലാസ്‌റൂമുകൾ സ്ഥാപിച്ചു. ഹൈ-ടെക് ഉപകരണങ്ങൾ, ഇന്ററാക്ടീവ് ബോർഡുകൾ, മൾട്ടിമീഡിയ പ്രൊജക്ടറുകൾ എന്നിവ ഉപയോഗിച്ച് വിദ്യാർത്ഥികൾക്ക് ആധുനിക പഠന അനുഭവം നൽകുന്നു.',
            statistics: [
              { label: 'സ്മാർട്ട് ക്ലാസ്‌റൂമുകൾ', value: '15,000+' },
              { label: 'പ്രയോജനം നേടുന്ന വിദ്യാർത്ഥികൾ', value: '45 ലക്ഷം' },
              { label: 'നിക്ഷേപം', value: '₹750 കോടി' },
              { label: 'പരിശീലനം നേടിയ അധ്യാപകർ', value: '75,000' },
            ],
            links: [
              { label: 'KITE - വിദ്യാഭ്യാസ സാങ്കേതിക വകുപ്പ്', url: 'https://kite.kerala.gov.in' },
              { label: 'VICTERS ചാനൽ', url: '#' },
            ],
            additionalInfo: [
              'എല്ലാ സർക്കാർ, എയ്ഡഡ് സ്കൂളുകളിലും സ്മാർട്ട് ക്ലാസ്‌റൂമുകൾ',
              'ഡിജിറ്റൽ കോൺടെന്റ് സംസ്ഥാന സിലബസിനനുസരിച്ച് തയ്യാറാക്കിയത്',
              'അധ്യാപകർക്ക് സമഗ്ര പരിശീലനം നൽകിയിട്ടുണ്ട്',
            ],
          },
        },
        {
          id: 'e2',
          title: 'സൗജന്യ ലാപ്‌ടോപ്പുകൾ',
          description: '2.5 ലക്ഷം വിദ്യാർത്ഥികൾക്ക് സൗജന്യ ലാപ്‌ടോപ്പുകൾ വിതരണം',
          tags: ['വിദ്യാഭ്യാസം', 'ഡിജിറ്റൽ'],
          icon: '💻',
          highlighted: true,
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1771408427146-09be9a1d4535?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGxhcHRvcCUyMGNvbXB1dGVyJTIwbGVhcm5pbmd8ZW58MXx8fHwxNzcyMTIwNTIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          id: 'e3',
          title: 'പുതിയ സർവകലാശാലകൾ',
          description: 'കായികം, ഡിജിറ്റൽ, ഹെൽത്ത് സയൻസ് സർവകലാശാലകൾ സ്ഥാപിച്ചു',
          tags: ['വിദ്യാഭ്യാസം', 'ആദ്യമായി'],
          icon: '🏛️',
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1631599143424-5bc234fbebf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzcyMDQ1OTQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          id: 'e4',
          title: 'സൗജന്യ പാഠപുസ്തകങ്ങൾ',
          description: 'എല്ലാ സർക്കാർ സ്കൂൾ വിദ്യാർത്ഥികൾക്കും സൗജന്യ പാഠപുസ്തകങ്ങൾ',
          tags: ['വിദ്യാഭ്യാസം'],
          icon: '📚',
        },
        {
          id: 'e5',
          title: 'KITE VICTERS - ഇ-ലേണിംഗ്',
          description: 'ഓൺലൈൻ വിദ്യാഭ്യാസത്തിനുള്ള സമഗ്ര പ്ലാറ്റ്‌ഫോം',
          tags: ['ഡിജിറ്റൽ', 'വിദ്യാഭ്യാസം'],
          icon: '📡',
        },
        {
          id: 'e6',
          title: 'വിദ്യാഭ്യാസ സ്‌കോളർഷിപ്പ്',
          description: '₹850 കോടി രൂപ വിദ്യാർത്ഥികൾക്ക് സ്‌കോളർഷിപ്പായി നൽകി',
          tags: ['വിദ്യാഭ്യാസം', 'സഹായം'],
          icon: '🎓',
        },
      ]
    },
    {
      id: 'welfare',
      name: 'സാമൂഹ്യ ക്ഷേമ വകുപ്പ്',
      icon: '🤝',
      count: 10,
      color: 'from-purple-500 to-pink-500',
      achievements: [
        {
          id: 'w1',
          title: 'സാമൂഹ്യ പെൻഷൻ',
          description: '60 ലക്ഷം പ്രായമായവർ, വിധവകൾ, വികലാംഗർക്ക് പെൻഷൻ',
          tags: ['ക്ഷേമം', 'സഹായം'],
          icon: '👴',
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1598286987849-41663a539ff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwcGVuc2lvbiUyMHdlbGZhcmUlMjBzdXBwb3J0fGVufDF8fHx8MTc3MjEyMDUyMHww&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          id: 'w2',
          title: 'കുടുംബശ്രീ',
          description: '45 ലക്��ം വനിതാ സ്വയം സഹായ സംഘങ്ങളിലെ അംഗങ്ങൾ',
          tags: ['ക്ഷേമം', 'തൊഴിൽ'],
          icon: '👩‍🤝‍👩',
          highlighted: true,
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1568680328385-4d5d41a69eee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHNlbGYlMjBoZWxwJTIwZ3JvdXAlMjBjb21tdW5pdHl8ZW58MXx8fHwxNzcyMTIwNTIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          id: 'w3',
          title: 'ലൈഫ് മിഷൻ',
          description: '4.5 ലക്ഷം ഭവനരഹിതർക്ക് വീടുകൾ നിർമ്മിച്ചു നൽകി',
          tags: ['ഭവനം', 'ക്ഷേമം'],
          icon: '🏠',
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1687079661069-ad6feb6b3c18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjBob3VzZSUyMGhvbWUlMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzcyMTIwNTIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          id: 'w4',
          title: 'അഞ്ചനവാടികൾ',
          description: '5,500+ കുട്ടികളുടെ പോഷകാഹാര കേന്ദ്രങ്ങൾ',
          tags: ['ക്ഷേമം', 'കുട്ടികൾ'],
          icon: '👶',
        },
        {
          id: 'w5',
          title: 'അന്നപൂർണ്ണ കാന്റീനുകൾ',
          description: '₹20 വില താങ്ങാനാവുന്ന ഗുണമേന്മയുള്ള ഭക്ഷണം',
          tags: ['ക്ഷേമം', 'ആരോഗ്യം'],
          icon: '🍽️',
        },
        {
          id: 'w6',
          title: 'വികലാംഗ പെൻഷൻ',
          description: 'വികലാംഗർക്ക് ₹1,600 പ്രതിമാസ പെൻഷൻ',
          tags: ['ക്ഷേമം', 'സഹായം'],
          icon: '♿',
        },
      ]
    },
    {
      id: 'agriculture',
      name: 'കൃഷി വകുപ്പ്',
      icon: '🌾',
      count: 8,
      color: 'from-green-500 to-emerald-500',
      achievements: [
        {
          id: 'a1',
          title: 'ജൈവകൃഷി',
          description: '1 ലക്ഷം ഹെക്ടർ ജൈവകൃഷി വിസ്തീർണ്ണം വർധിപ്പിച്ചു',
          tags: ['കൃഷി', 'പരിസ്ഥിതി'],
          icon: '🌱',
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1543416198-249beb35642f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmFybWluZyUyMGFncmljdWx0dXJlJTIwZ3JlZW58ZW58MXx8fHwxNzcyMTIwNTIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          id: 'a2',
          title: 'കർഷക ക്ഷേമനിധി',
          description: '₹2,000 കോടി കർഷകർക്ക് സാമ്പത്തിക സഹായം',
          tags: ['കൃഷി', 'സഹായം'],
          icon: '👨‍🌾',
          highlighted: true,
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1707721691170-bf913a7a6231?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjBmaWVsZCUyMGluZGlhJTIwYWdyaWN1bHR1cmV8ZW58MXx8fHwxNzcyMTIwNTIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          id: 'a3',
          title: 'കമ്മ്യൂണിറ്റി കിച്ചണുകൾ',
          description: '1,000+ പ്രാദേശിക കാർഷിക ഉൽപന്നങ്ങൾ വിൽക്കുന്ന കേന്ദ്രങ്ങൾ',
          tags: ['കൃഷി', 'വിവരുദ്യന്ന്'],
          icon: '🏪',
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1761926972175-b3302536506f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMG1hcmtldCUyMHZlZ2V0YWJsZSUyMHByb2R1Y2V8ZW58MXx8fHwxNzcyMTIwNTIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          id: 'a4',
          title: 'കാർഷിക സബ്സിഡി',
          description: '₹500 കോടി കാർഷിക ഉപകരണങ്ങൾക്ക് സബ്സിഡി',
          tags: ['കൃഷി'],
          icon: '🚜',
        },
        {
          id: 'a5',
          title: 'ജലസേചന പദ്ധതികൾ',
          description: '250 പുതിയ ജലസേചന പദ്ധതികൾ നടപ്പാക്കി',
          tags: ['കൃഷി', 'വികസനം'],
          icon: '💧',
        },
        {
          id: 'a6',
          title: 'കീടനാശിനി രഹിത കൃഷി',
          description: '50,000 ഹെക്ടർ കീടനാശിനി രഹിത കൃഷി പ്രോത്സാഹിപ്പിച്ചു',
          tags: ['കൃഷി', 'ആരോഗ്യം'],
          icon: '🌿',
        },
      ]
    },
  ];

  const filterTags = [
    'ആദ്യമായി',
    'ദേശീയ അംഗീകാരം',
    'കേന്ദ്രം',
    'വികസനം',
    'ഡിജിറ്റൽ',
    'ആരോഗ്യം',
    'തൊഴിൽ',
    'വിവരുദ്യന്ന്',
    'കൃഷി',
    'യുവജനം',
    'സഹ���യം',
    'ഗതാഗതം',
    'സ്ഥാപയം',
    'നേതവം',
    'ഭവനം',
    'കായികം',
  ];

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Filter departments based on active category
  const filteredDepartments = activeCategory === 'എല്ലാം (All)' 
    ? departments 
    : departments.filter(dept => {
        const categoryMap: Record<string, string> = {
          '🏥 ആരോഗ്യ വകുപ്പ്': 'health',
          '🎓 സാമൂഹ്യ വകുപ്പ്': 'education',
          '🏛️ ക്ഷേമ വകുപ്പ്': 'welfare',
          '💰 പേയ്മെന്റ്സ് വകുപ്പ്': 'finance',
          '⚡ കോൺഫിൽ വകുപ്പ്': 'other',
          '🌾 ആരോഗ്യ വകുപ്പ്': 'agriculture',
        };
        return dept.id === categoryMap[activeCategory];
      });

  // Filter achievements based on selected tags (OR logic) and search query
  const getFilteredAchievements = (achievements: Achievement[]) => {
    return achievements.filter(achievement => {
      // Search query filter
      const matchesSearch = !searchQuery || 
        achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Tag filter (OR logic - show if achievement has ANY of the selected tags)
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => achievement.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
                <Building2 className="w-10 h-10" />
                കേരള സർക്കാർ നേട്ടങ്ങൾ
              </h1>
              <p className="text-emerald-100 text-lg">Kerala Government Department Achievements</p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.label)}
                className={`px-5 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeCategory === cat.label
                    ? 'bg-amber-400 text-gray-900 shadow-lg scale-105'
                    : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100"
            >
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Search and Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="തിരയുക / Search achievements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2">
            {filterTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                  selectedTags.includes(tag)
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                    : 'bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 border-gray-200 hover:border-emerald-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Sections */}
      {filteredDepartments.map((department) => {
        const filteredAchievements = getFilteredAchievements(department.achievements);
        
        // Don't show department if no achievements match the filters
        if (filteredAchievements.length === 0) return null;
        
        return (
          <section key={department.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${department.color} rounded-lg flex items-center justify-center text-2xl shadow-lg`}>
                  {department.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{department.name}</h2>
              </div>
              <button 
                onClick={() => setSelectedDepartment(department)}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all flex items-center gap-2 font-medium shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Read All</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-gray-100 hover:border-emerald-200 overflow-hidden"
              >
                {/* Media Section */}
                {achievement.mediaType && achievement.mediaUrl && (
                  <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {achievement.mediaType === 'image' ? (
                      <img
                        src={achievement.mediaUrl}
                        alt={achievement.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black">
                        <Play className="w-16 h-16 text-white opacity-80" />
                      </div>
                    )}
                  </div>
                )}

                {/* Content Section */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 text-lg mb-2 leading-tight line-clamp-2">
                    {achievement.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                    {achievement.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {achievement.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedAchievement(achievement)}
                      className="flex-1 text-emerald-600 hover:text-emerald-700 text-sm font-semibold flex items-center justify-center gap-1 group"
                    >
                      വിശദമായി വായിക്കുക (Read More)
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const text = `${achievement.title}\n\n${achievement.description}\n\nകേരള സർക്കാർ നേട്ടങ്ങൾ`;
                        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                        window.open(url, '_blank');
                      }}
                      className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all flex items-center gap-1.5 shadow-md"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
      })}

      {/* Detailed View Modal */}
      <Dialog.Root open={!!selectedAchievement} onOpenChange={(open) => !open && setSelectedAchievement(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content aria-describedby={undefined} className="fixed left-[50%] top-[50%] z-50 max-h-[90vh] w-[95vw] max-w-4xl translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-xl bg-white shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            {selectedAchievement && (
              <div>
                {/* Media Header */}
                {selectedAchievement.mediaType && selectedAchievement.mediaUrl && (
                  <div className="relative aspect-square w-full bg-gradient-to-br from-gray-100 to-gray-200">
                    {selectedAchievement.mediaType === 'image' ? (
                      <img
                        src={selectedAchievement.mediaUrl}
                        alt={selectedAchievement.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black">
                        <video controls className="w-full h-full">
                          <source src={selectedAchievement.mediaUrl} />
                        </video>
                      </div>
                    )}
                  </div>
                )}

                {/* Close Button */}
                <Dialog.Close className="absolute top-4 right-4 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white transition-colors">
                  <X className="w-5 h-5 text-gray-700" />
                </Dialog.Close>

                {/* Content */}
                <div className="p-6 sm:p-8">
                  <Dialog.Title className="text-3xl font-bold text-gray-800 mb-4">
                    {selectedAchievement.title}
                  </Dialog.Title>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedAchievement.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <Dialog.Description className="text-gray-700 text-lg leading-relaxed mb-6">
                    {selectedAchievement.detailedReport?.fullDescription || selectedAchievement.description}
                  </Dialog.Description>

                  {/* Statistics */}
                  {selectedAchievement.detailedReport?.statistics && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">പ്രധാന സ്ഥിതിവിവരക്കണക്കുകൾ</h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {selectedAchievement.detailedReport.statistics.map((stat, idx) => (
                          <div key={idx} className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg p-4 border border-emerald-200">
                            <div className="text-2xl font-bold text-emerald-600 mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-700 font-medium">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  {selectedAchievement.detailedReport?.additionalInfo && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">കൂടുതൽ വിവരങ്ങൾ</h3>
                      <ul className="space-y-3">
                        {selectedAchievement.detailedReport.additionalInfo.map((info, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{info}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Links */}
                  {selectedAchievement.detailedReport?.links && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">ഉപയോഗപ്രദമായ ലിങ്കുകൾ</h3>
                      <div className="flex flex-wrap gap-3">
                        {selectedAchievement.detailedReport.links.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all flex items-center gap-2 font-medium shadow-md"
                          >
                            {link.label}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* WhatsApp Share Button */}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        const text = `${selectedAchievement.title}\n\n${selectedAchievement.detailedReport?.fullDescription || selectedAchievement.description}\n\nകേരള സർക്കാർ നേട്ടങ്ങൾ`;
                        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                        window.open(url, '_blank');
                      }}
                      className="w-full px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all flex items-center justify-center gap-2 font-medium shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Share on WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Department Read All Modal */}
      <Dialog.Root open={!!selectedDepartment} onOpenChange={(open) => !open && setSelectedDepartment(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content aria-describedby={undefined} className="fixed left-[50%] top-[50%] z-50 max-h-[90vh] w-[95vw] max-w-6xl translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-xl bg-white shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            {selectedDepartment && (
              <div>
                {/* Header */}
                <div className={`bg-gradient-to-r ${selectedDepartment.color} p-8 text-white sticky top-0 z-10`}>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-4xl shadow-lg">
                      {selectedDepartment.icon}
                    </div>
                    <div>
                      <Dialog.Title className="text-3xl font-bold">
                        {selectedDepartment.name}
                      </Dialog.Title>
                      <p className="text-white/90 text-lg mt-1">All Achievements - Complete Details</p>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <Dialog.Close className="absolute top-4 right-4 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white transition-colors z-20">
                  <X className="w-5 h-5 text-gray-700" />
                </Dialog.Close>

                {/* Content */}
                <div className="p-6 sm:p-8">
                  <div className="prose prose-lg max-w-none">
                    {selectedDepartment.achievements.map((achievement, idx) => (
                      <div key={achievement.id} className="mb-8 pb-8 border-b border-gray-200 last:border-0">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">{achievement.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {achievement.tags.map((tag, tagIdx) => (
                                <span
                                  key={tagIdx}
                                  className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="pl-14">
                          <p className="text-gray-700 leading-relaxed mb-4 text-base">
                            {achievement.detailedReport?.fullDescription || achievement.description}
                          </p>
                          
                          {/* Statistics */}
                          {achievement.detailedReport?.statistics && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                              {achievement.detailedReport.statistics.map((stat, statIdx) => (
                                <div key={statIdx} className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg p-3 border border-emerald-200">
                                  <div className="text-xl font-bold text-emerald-600">{stat.value}</div>
                                  <div className="text-xs text-gray-700 font-medium">{stat.label}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Additional Info */}
                          {achievement.detailedReport?.additionalInfo && (
                            <ul className="space-y-2 mb-4">
                              {achievement.detailedReport.additionalInfo.map((info, infoIdx) => (
                                <li key={infoIdx} className="flex items-start gap-2 text-sm text-gray-600">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                  <span>{info}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* WhatsApp Share All Button */}
                  <div className="mt-8 pt-6 border-t border-gray-200 sticky bottom-0 bg-white">
                    <button
                      onClick={() => {
                        const achievementsList = selectedDepartment.achievements
                          .map((ach, idx) => `${idx + 1}. ${ach.title}\n   ${ach.detailedReport?.fullDescription || ach.description}`)
                          .join('\n\n');
                        const text = `${selectedDepartment.name}\n\n${achievementsList}\n\nകേരള സർക്കാർ നേട്ടങ്ങൾ`;
                        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                        window.open(url, '_blank');
                      }}
                      className="w-full px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all flex items-center justify-center gap-2 font-medium shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Share All on WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}