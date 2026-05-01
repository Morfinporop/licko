import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';

const FEATURES = [
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    title: 'Быстрое создание',
    desc: 'Создайте свою персональную страницу за 2 минуты. Никаких сложных настроек.'
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>,
    title: 'Полная настройка',
    desc: 'Настройте каждый элемент: цвета, шрифты, анимации, размеры и многое другое.'
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    title: 'Аналитика',
    desc: 'Отслеживайте просмотры и клики по ссылкам. Анализируйте эффективность.'
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
    title: 'Адаптивность',
    desc: 'Идеально выглядит на любых устройствах: телефоны, планшеты, компьютеры.'
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
    title: 'Безопасность',
    desc: 'Защита данных, безопасное хранение, резервные копии и шифрование.'
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
    title: 'Без ограничений',
    desc: 'Неограниченное количество ссылок, социальных сетей и кастомизация.'
  }
];

const TESTIMONIALS = [
  {
    name: 'Алексей Морозов',
    role: 'Digital-маркетолог',
    avatar: 'https://i.pravatar.cc/150?img=12',
    text: 'Лучший сервис для создания bio-страниц! Использую уже полгода, клиенты находят все мои контакты в одном месте. Аналитика помогает понять, какие ссылки работают лучше.',
    rating: 5
  },
  {
    name: 'Мария Петрова',
    role: 'Блогер и инфлюенсер',
    avatar: 'https://i.pravatar.cc/150?img=5',
    text: 'Раньше пользовалась другими сервисами, но BioLink превзошел все ожидания. Невероятно красивый дизайн, множество настроек и при этом очень простой в использовании.',
    rating: 5
  },
  {
    name: 'Дмитрий Соколов',
    role: 'Владелец бизнеса',
    avatar: 'https://i.pravatar.cc/150?img=33',
    text: 'Профессиональный инструмент за разумные деньги. Интегрировал все свои соцсети и мессенджеры. Клиенты оставляют отзывы, что очень удобно связаться.',
    rating: 5
  },
  {
    name: 'Екатерина Волкова',
    role: 'Фотограф',
    avatar: 'https://i.pravatar.cc/150?img=9',
    text: 'Идеальное решение для творческих людей! Загрузила своё портфолио, добавила ссылки на соцсети и WhatsApp. Заявок стало в 2 раза больше!',
    rating: 5
  }
];

const STATS = [
  { value: '50,000+', label: 'Активных пользователей' },
  { value: '1M+', label: 'Просмотров в месяц' },
  { value: '99.9%', label: 'Время работы' },
  { value: '24/7', label: 'Поддержка' }
];

export function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const [floatingImages, setFloatingImages] = useState<Array<{ id: number; x: number; y: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Generate floating images positions
    const images = [];
    for (let i = 0; i < 6; i++) {
      images.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 20 + Math.random() * 10
      });
    }
    setFloatingImages(images);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Floating Background Images */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5">
        {floatingImages.map((img, idx) => (
          <img
            key={img.id}
            src={`/bio-example-${(idx % 3) + 1}.png`}
            alt=""
            className="absolute w-64 h-auto opacity-30 animate-float"
            style={{
              left: `${img.x}%`,
              top: `${img.y}%`,
              animationDelay: `${img.delay}s`,
              animationDuration: `${img.duration}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <img src="https://png.pngtree.com/png-clipart/20210606/original/pngtree-bio-logo-green-organic-leaf-png-image_6387668.jpg" alt="BioLink Logo" className="w-24 h-24 rounded-full object-cover" />
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 leading-tight">
            <span className="text-white">BioLink</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              Создай свою карточку
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Единая страница со всеми вашими ссылками, контактами и социальными сетями. 
            Профессионально, быстро и без лишних движений.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button variant="primary" size="lg" className="min-w-[200px]">
                    Перейти в кабинет
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
                <Link to="/editor">
                  <Button variant="secondary" size="lg" className="min-w-[200px]">Редактор</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="primary" size="lg" className="min-w-[200px]">
                    Начать бесплатно
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg" className="min-w-[200px]">Войти</Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Всё что нужно для успеха</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Профессиональные инструменты для создания идеальной био-страницы
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <GlassCard key={feature.title} className="p-8 hover:border-green-500/30 transition-all duration-300" hover>
                <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 mb-5 shadow-lg shadow-green-500/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 px-4 border-t border-white/5 bg-gradient-to-b from-transparent to-green-500/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Отзывы наших пользователей</h2>
            <p className="text-gray-400 text-lg">
              Более 50,000 человек уже используют BioLink для своего бизнеса
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((testimonial, idx) => (
              <GlassCard key={idx} className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full border-2 border-green-500/30"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-lg">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    <div className="flex gap-1 mt-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed italic">"{testimonial.text}"</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-24 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Почему выбирают BioLink?
              </h2>
              <div className="space-y-6">
                {[
                  { icon: '✓', text: 'Бесплатная регистрация и базовые функции' },
                  { icon: '✓', text: 'Полная кастомизация дизайна под ваш бренд' },
                  { icon: '✓', text: 'Детальная аналитика и статистика' },
                  { icon: '✓', text: 'Без рекламы и водяных знаков (VIP)' },
                  { icon: '✓', text: 'Техподдержка 24/7' },
                  { icon: '✓', text: 'Регулярные обновления и новые функции' }
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <p className="text-gray-300 text-lg">{benefit.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <GlassCard className="p-8 border-green-500/30" glow>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <span className="text-white font-medium">Бесплатный план</span>
                    <span className="text-green-400 font-bold">₽0/мес</span>
                  </div>
                  <ul className="space-y-3 text-gray-400">
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Неограниченные ссылки
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Базовая аналитика
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Все темы оформления
                    </li>
                  </ul>

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                      <span className="text-white font-medium">VIP план</span>
                      <span className="text-green-400 font-bold">По запросу</span>
                    </div>
                    <ul className="space-y-3 text-gray-400 mt-4">
                      <li className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Без водяных знаков
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Расширенные настройки
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Приоритетная поддержка
                      </li>
                    </ul>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard className="p-12 border-green-500/20" glow>
            <h2 className="text-4xl font-bold text-white mb-4">
              Готовы создать свою страницу?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к тысячам пользователей, которые уже используют BioLink для развития своего бренда
            </p>
            {!isAuthenticated && (
              <Link to="/register">
                <Button variant="primary" size="lg" className="min-w-[250px]">
                  Начать бесплатно
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
            )}
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="https://png.pngtree.com/png-clipart/20210606/original/pngtree-bio-logo-green-organic-leaf-png-image_6387668.jpg" alt="BioLink" className="w-10 h-10 rounded-full object-cover" />
                <span className="text-white font-bold text-xl">BioLink</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Профессиональный сервис для создания персональных био-страниц
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Продукт</h4>
              <ul className="space-y-2">
                <li><Link to="/register" className="text-gray-500 hover:text-green-400 transition-colors text-sm">Регистрация</Link></li>
                <li><Link to="/login" className="text-gray-500 hover:text-green-400 transition-colors text-sm">Вход</Link></li>
                <li><a href="#features" className="text-gray-500 hover:text-green-400 transition-colors text-sm">Возможности</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2">
                <li><a href="mailto:support@biolink.ru" className="text-gray-500 hover:text-green-400 transition-colors text-sm">Написать в поддержку</a></li>
                <li><a href="#" className="text-gray-500 hover:text-green-400 transition-colors text-sm">FAQ</a></li>
                <li><a href="#" className="text-gray-500 hover:text-green-400 transition-colors text-sm">Документация</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2">
                <li className="text-gray-500 text-sm">Email: support@biolink.ru</li>
                <li className="text-gray-500 text-sm">Работаем 24/7</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 text-center">
            <p className="text-gray-600 text-sm">
              © 2024 BioLink. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
