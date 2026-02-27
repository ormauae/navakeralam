import { useState } from 'react';
import { Search, CheckCircle2, Building2, X, ExternalLink, Play } from 'lucide-react';
import departmentsData from '@/data/departments.json';
import statsData from '@/data/stats.json';
import * as Dialog from '@radix-ui/react-dialog';

interface Achievement {
  title: string;
  description: string;
  tags: string[];
  highlighted?: boolean;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  detailedReport?: {
    fullDescription: string;
    statistics: { label: string; value: string }[];
    links: string[];
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

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());

  const PAGE_SIZE = 9;

  const departments: Department[] = departmentsData as Department[];

  const categories = [
    { id: 'all', label: 'എല്ലാം (All)', icon: '📋' },
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

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Filter departments based on active category
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
      parts.push(achievement.detailedReport.links.join('\n'));
    }
    return parts.join('\n\n');
  };

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
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? 'bg-amber-400 text-gray-900 shadow-lg scale-105'
                    : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                <span>{cat.icon} {cat.label}</span>
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

        const isExpanded = expandedDepartments.has(department.id);
        const visibleAchievements = isExpanded ? filteredAchievements : filteredAchievements.slice(0, PAGE_SIZE);
        const hasMore = filteredAchievements.length > PAGE_SIZE;

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
              {visibleAchievements.map((achievement, idx) => (
              <div
                key={idx}
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
                        const url = `https://wa.me/?text=${encodeURIComponent(buildShareText(achievement))}`;
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

          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setExpandedDepartments(prev => {
                  const next = new Set(prev);
                  isExpanded ? next.delete(department.id) : next.add(department.id);
                  return next;
                })}
                className="px-6 py-3 bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium transition-all shadow-sm"
              >
                {isExpanded
                  ? 'Show Less'
                  : 'View More'}
              </button>
            </div>
          )}
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
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all flex items-center gap-2 font-medium shadow-md"
                          >
                            {link}
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
                        const url = `https://wa.me/?text=${encodeURIComponent(buildShareText(selectedAchievement))}`;
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
                      <div key={idx} className="mb-8 pb-8 border-b border-gray-200 last:border-0">
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
                          .map((ach, idx) => `${idx + 1}. ${buildShareText(ach)}`)
                          .join('\n\n---\n\n');
                        const text = `${selectedDepartment.name}\n\n${achievementsList}`;
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