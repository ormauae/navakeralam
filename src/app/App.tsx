import { useState } from 'react';
import { Search, CheckCircle2, X, ExternalLink, Play, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import departmentsData from '@/data/departments.json';
import statsData from '@/data/stats.json';
import * as Dialog from '@radix-ui/react-dialog';

interface Achievement {
  title: string;
  description: string;
  tags: string[];
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
  color: string;
  achievements: Achievement[];
}

const WhatsAppIcon = ({ size = 4 }: { size?: number }) => (
  <svg className={`w-${size} h-${size}`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());
  const [isDeptSheetOpen, setIsDeptSheetOpen] = useState(false);

  const PAGE_SIZE = 9;

  const departments: Department[] = departmentsData as Department[];

  const categories = [
    { id: 'all', label: 'എല്ലാം', icon: '📋' },
    ...departments.map(dept => ({ id: dept.id, label: dept.name, icon: dept.icon })),
  ];

  const stats = statsData;

  const filterTags = Object.entries(
    departments.flatMap(dept => dept.achievements.flatMap(a => a.tags))
      .reduce<Record<string, number>>((acc, tag) => {
        acc[tag] = (acc[tag] ?? 0) + 1;
        return acc;
      }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredDepartments = activeCategory === 'all'
    ? departments
    : departments.filter(dept => dept.id === activeCategory);

  const buildShareText = (achievement: Achievement) => {
    const parts = [achievement.title, achievement.detailedReport?.fullDescription || achievement.description];
    if (achievement.detailedReport?.statistics?.length) {
      parts.push(achievement.detailedReport.statistics.map(s => `• ${s.label}: ${s.value}`).join('\n'));
    }
    if (achievement.detailedReport?.additionalInfo?.length) {
      parts.push(achievement.detailedReport.additionalInfo.map(i => `✓ ${i}`).join('\n'));
    }
    if (achievement.detailedReport?.links?.length) {
      parts.push(achievement.detailedReport.links.map(l => `${l.label}: ${l.url}`).join('\n'));
    }
    return parts.join('\n\n');
  };

  const getFilteredAchievements = (achievements: Achievement[]) => {
    return achievements.filter(achievement => {
      const matchesSearch = !searchQuery ||
        achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => achievement.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">

      {/* Header */}
      <header className="relative text-white shadow-2xl overflow-hidden" style={{background: 'linear-gradient(135deg, #022c22 0%, #064e3b 30%, #065f46 60%, #0f766e 100%)'}}>

        {/* Warm sun glow top-center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-amber-400/10 rounded-full -translate-y-1/2 blur-3xl pointer-events-none" />
        {/* Teal shimmer bottom-left */}
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-300/15 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl pointer-events-none" />

        {/* Palm tree silhouettes */}
        <div className="absolute bottom-0 right-0 flex items-end gap-2 pr-6 opacity-[0.12] pointer-events-none select-none">
          {/* Short palm */}
          <svg width="70" height="110" viewBox="0 0 70 110" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M33 110 C31 95 29 78 30 62 C31 46 33 36 35 26 C37 36 39 46 40 62 C41 78 39 95 37 110Z"/>
            <path d="M35 28 C22 22 8 26 0 20 C12 13 27 20 35 26"/>
            <path d="M35 28 C48 22 62 26 70 20 C58 13 43 20 35 26"/>
            <path d="M35 28 C20 16 18 4 24 0 C27 10 31 20 35 26"/>
            <path d="M35 28 C50 16 52 4 46 0 C43 10 39 20 35 26"/>
            <path d="M35 28 C32 12 34 2 35 0 C36 4 37 14 35 26"/>
            <ellipse cx="33" cy="29" rx="3" ry="2.5"/>
            <ellipse cx="38" cy="31" rx="3" ry="2.5"/>
          </svg>
          {/* Tall palm */}
          <svg width="80" height="150" viewBox="0 0 80 150" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M38 150 C36 130 33 108 34 88 C35 68 37 52 40 38 C43 52 45 68 46 88 C47 108 44 130 42 150Z"/>
            <path d="M40 40 C25 32 8 36 0 28 C14 20 30 28 40 38"/>
            <path d="M40 40 C55 32 72 36 80 28 C66 20 50 28 40 38"/>
            <path d="M40 40 C24 26 21 10 28 5 C31 18 36 30 40 38"/>
            <path d="M40 40 C56 26 59 10 52 5 C49 18 44 30 40 38"/>
            <path d="M40 40 C36 20 38 5 40 0 C42 6 43 22 40 38"/>
            <path d="M40 40 C28 30 20 18 22 10 C28 20 35 32 40 38"/>
            <path d="M40 40 C52 30 60 18 58 10 C52 20 45 32 40 38"/>
            <ellipse cx="38" cy="41" rx="4" ry="3"/>
            <ellipse cx="44" cy="43" rx="4" ry="3"/>
            <ellipse cx="40" cy="46" rx="3.5" ry="2.5"/>
          </svg>
          {/* Medium palm */}
          <svg width="60" height="120" viewBox="0 0 60 120" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M28 120 C26 104 24 86 25 70 C26 54 28 42 30 30 C32 42 34 54 35 70 C36 86 34 104 32 120Z"/>
            <path d="M30 32 C18 26 5 30 0 23 C11 16 25 23 30 30"/>
            <path d="M30 32 C42 26 55 30 60 23 C49 16 35 23 30 30"/>
            <path d="M30 32 C16 20 14 7 20 2 C23 13 27 23 30 30"/>
            <path d="M30 32 C44 20 46 7 40 2 C37 13 33 23 30 30"/>
            <path d="M30 32 C27 16 29 4 30 0 C31 5 32 18 30 30"/>
            <ellipse cx="28" cy="33" rx="3" ry="2.5"/>
            <ellipse cx="33" cy="35" rx="3" ry="2.5"/>
          </svg>
        </div>

        {/* Subtle horizontal light rays */}
        <div className="absolute inset-0 pointer-events-none" style={{background: 'radial-gradient(ellipse at 15% 50%, rgba(251,191,36,0.06) 0%, transparent 60%)'}} />

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 28" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 28 Q180 8 360 18 Q540 28 720 14 Q900 0 1080 12 Q1260 24 1440 8 L1440 28 Z" fill="rgba(255,255,255,0.04)"/>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="flex items-start gap-3">
                <span className="text-4xl sm:text-5xl mt-1">🌴</span>
                <div>
                  <h1 className="text-4xl sm:text-6xl font-bold mb-1 tracking-tight">നവകേരളം</h1>
                  <p className="text-emerald-300/80 text-base">നാടിന്റെ മുഖച്ഛായ മാറ്റിയ 10 വർഷങ്ങൾ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Department filter button — all screen sizes */}
          <div className="mt-6">
            <button
              onClick={() => setIsDeptSheetOpen(true)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl border border-white/20 transition-all duration-200"
            >
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="w-4 h-4 text-white/70" />
                <span className="font-medium text-sm">
                  {activeCategory === 'all'
                    ? 'എല്ലാ വകുപ്പുകളും'
                    : categories.find(c => c.id === activeCategory)?.icon + ' ' + categories.find(c => c.id === activeCategory)?.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {activeCategory !== 'all' && (
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                )}
                <ChevronDown className="w-4 h-4 text-white/70" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Search and Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          {/* Search Bar */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="തിരയുക..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-gray-700 placeholder-gray-400 transition-all duration-200 focus:shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5 text-gray-600" />
              </button>
            )}
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2">
            {filterTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border flex items-center gap-1.5 ${
                  selectedTags.includes(tag)
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-200 scale-105'
                    : 'bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 text-gray-600 border-gray-200 hover:border-emerald-300 hover:scale-105'
                }`}
              >
                {selectedTags.includes(tag) && <span className="text-xs leading-none">✓</span>}
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      {filteredDepartments.map((department) => {
        const filteredAchievements = getFilteredAchievements(department.achievements);
        if (filteredAchievements.length === 0) return null;

        const isExpanded = expandedDepartments.has(department.id);
        const visibleAchievements = isExpanded ? filteredAchievements : filteredAchievements.slice(0, PAGE_SIZE);
        const hasMore = filteredAchievements.length > PAGE_SIZE;

        return (
          <section key={department.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pb-4">
            {/* Department Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${department.color} rounded-2xl flex items-center justify-center text-2xl shadow-xl`}>
                  {department.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{department.name}</h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedDepartment(department)}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Read All</span>
              </button>
            </div>

            {/* Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleAchievements.map((achievement, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedAchievement(achievement)}
                  className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 overflow-hidden cursor-pointer group hover:-translate-y-2"
                >
                  {/* Top accent bar */}
                  <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

                  {/* Media */}
                  {achievement.mediaType && achievement.mediaUrl && (
                    <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      {achievement.mediaType === 'image' ? (
                        <img
                          src={achievement.mediaUrl}
                          alt={achievement.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black">
                          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 group-hover:text-emerald-700 transition-colors duration-200 text-lg mb-2 leading-tight line-clamp-2">
                      {achievement.title}
                    </h3>

                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                      {achievement.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {achievement.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedAchievement(achievement); }}
                        className="flex-1 text-emerald-600 hover:text-emerald-800 text-sm font-semibold flex items-center justify-start gap-1.5 group/btn"
                      >
                        വിശദമായി വായിക്കുക
                        <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = `https://wa.me/?text=${encodeURIComponent(buildShareText(achievement))}`;
                          window.open(url, '_blank');
                        }}
                        className="px-3 py-2 border-2 border-green-500 text-green-500 hover:bg-green-50 active:scale-95 rounded-xl transition-all duration-200 flex items-center gap-1.5"
                      >
                        <WhatsAppIcon size={4} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View More */}
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setExpandedDepartments(prev => {
                    const next = new Set(prev);
                    isExpanded ? next.delete(department.id) : next.add(department.id);
                    return next;
                  })}
                  className="px-8 py-3 bg-white border-2 border-emerald-400 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-emerald-200 hover:-translate-y-0.5 inline-flex items-center gap-2"
                >
                  {isExpanded ? (
                    <><ChevronUp className="w-4 h-4" />Show Less</>
                  ) : (
                    <><ChevronDown className="w-4 h-4" />View {filteredAchievements.length - PAGE_SIZE} More</>
                  )}
                </button>
              </div>
            )}
          </section>
        );
      })}

      {/* Achievement Detail Modal */}
      <Dialog.Root open={!!selectedAchievement} onOpenChange={(open) => !open && setSelectedAchievement(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content aria-describedby={undefined} className="fixed left-[50%] top-[50%] z-50 max-h-[90vh] w-[95vw] max-w-4xl translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-2xl bg-white shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            {selectedAchievement && (
              <div>
                <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

                {selectedAchievement.mediaType && selectedAchievement.mediaUrl && (
                  <div className="relative aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200">
                    {selectedAchievement.mediaType === 'image' ? (
                      <img src={selectedAchievement.mediaUrl} alt={selectedAchievement.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black">
                        <video controls className="w-full h-full">
                          <source src={selectedAchievement.mediaUrl} />
                        </video>
                      </div>
                    )}
                  </div>
                )}

                <Dialog.Close className="absolute top-4 right-4 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white hover:scale-110 transition-all z-10">
                  <X className="w-5 h-5 text-gray-700" />
                </Dialog.Close>

                <div className="p-6 sm:p-8">
                  <Dialog.Title className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 leading-snug">
                    {selectedAchievement.title}
                  </Dialog.Title>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedAchievement.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-100">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Dialog.Description className="text-gray-600 text-base leading-relaxed mb-8">
                    {selectedAchievement.detailedReport?.fullDescription || selectedAchievement.description}
                  </Dialog.Description>

                  {selectedAchievement.detailedReport?.statistics && selectedAchievement.detailedReport.statistics.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full inline-block" />
                        പ്രധാന സ്ഥിതിവിവരക്കണക്കുകൾ
                      </h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {selectedAchievement.detailedReport.statistics.map((stat, idx) => (
                          <div key={idx} className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100 hover:shadow-md transition-shadow">
                            <div className="text-2xl font-bold text-emerald-600 mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedAchievement.detailedReport?.additionalInfo && selectedAchievement.detailedReport.additionalInfo.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full inline-block" />
                        കൂടുതൽ വിവരങ്ങൾ
                      </h3>
                      <ul className="space-y-3">
                        {selectedAchievement.detailedReport.additionalInfo.map((info, idx) => (
                          <li key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm leading-relaxed">{info}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedAchievement.detailedReport?.links && selectedAchievement.detailedReport.links.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full inline-block" />
                        ഉപയോഗപ്രദമായ ലിങ്കുകൾ
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {selectedAchievement.detailedReport.links.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all duration-200 flex items-center gap-2 font-medium shadow-md hover:shadow-emerald-200 hover:-translate-y-0.5"
                          >
                            {link.label}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        const url = `https://wa.me/?text=${encodeURIComponent(buildShareText(selectedAchievement))}`;
                        window.open(url, '_blank');
                      }}
                      className="w-full px-5 py-3.5 bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 font-medium shadow-lg hover:shadow-green-200"
                    >
                      <WhatsAppIcon size={5} />
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
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content aria-describedby={undefined} className="fixed left-[50%] top-[50%] z-50 max-h-[90vh] w-[95vw] max-w-6xl translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-2xl bg-white shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            {selectedDepartment && (
              <div>
                <div className={`bg-gradient-to-r ${selectedDepartment.color} p-8 text-white sticky top-0 z-10 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl shadow-xl">
                      {selectedDepartment.icon}
                    </div>
                    <div>
                      <Dialog.Title className="text-2xl sm:text-3xl font-bold">
                        {selectedDepartment.name}
                      </Dialog.Title>
                    </div>
                  </div>
                </div>

                <Dialog.Close className="absolute top-4 right-4 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white hover:scale-110 transition-all z-20">
                  <X className="w-5 h-5 text-gray-700" />
                </Dialog.Close>

                <div className="p-6 sm:p-8">
                  {selectedDepartment.achievements.map((achievement, idx) => (
                    <div key={idx} className="mb-8 pb-8 border-b border-gray-100 last:border-0">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 leading-snug">{achievement.title}</h3>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {achievement.tags.map((tag, tagIdx) => (
                              <span key={tagIdx} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="pl-14">
                        <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                          {achievement.detailedReport?.fullDescription || achievement.description}
                        </p>
                        {achievement.detailedReport?.statistics && achievement.detailedReport.statistics.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                            {achievement.detailedReport.statistics.map((stat, statIdx) => (
                              <div key={statIdx} className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-100">
                                <div className="text-lg font-bold text-emerald-600">{stat.value}</div>
                                <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        {achievement.detailedReport?.additionalInfo && achievement.detailedReport.additionalInfo.length > 0 && (
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

                  <div className="mt-8 pt-6 border-t border-gray-100 sticky bottom-0 bg-white">
                    <button
                      onClick={() => {
                        const achievementsList = selectedDepartment.achievements
                          .map((ach, idx) => `${idx + 1}. ${buildShareText(ach)}`)
                          .join('\n\n---\n\n');
                        const text = `${selectedDepartment.name}\n\n${achievementsList}`;
                        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                        window.open(url, '_blank');
                      }}
                      className="w-full px-5 py-3.5 bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 font-medium shadow-lg hover:shadow-green-200"
                    >
                      <WhatsAppIcon size={5} />
                      Share All on WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Department bottom sheet */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${isDeptSheetOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isDeptSheetOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsDeptSheetOpen(false)}
        />
        {/* Sheet — full-width on mobile, centered panel on desktop */}
        <div className={`absolute bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:max-w-3xl md:rounded-t-2xl bg-white rounded-t-2xl transition-transform duration-300 ease-out ${isDeptSheetOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Sheet header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">വകുപ്പ് തിരഞ്ഞെടുക്കുക</h2>
            <button
              onClick={() => setIsDeptSheetOpen(false)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Department grid */}
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[65vh] overflow-y-auto pb-8">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setIsDeptSheetOpen(false); }}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100'
                      : 'border-gray-100 bg-gray-50 hover:border-emerald-200 hover:bg-emerald-50/50'
                  }`}
                >
                  <span className="text-2xl flex-shrink-0">{cat.icon}</span>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold leading-tight truncate ${isActive ? 'text-emerald-700' : 'text-gray-800'}`}>
                      {cat.label}
                    </p>
                  </div>
                  {isActive && (
                    <span className="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
