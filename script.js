
        // نظام إدارة الطلبات
        class ServiceManager {
            constructor() {
                this.orders = JSON.parse(localStorage.getItem('serviceOrders')) || [];
                this.init();
            }

            init() {
                this.setupForm();
                this.setupSmoothScroll();
                this.setupAnimations();
            }

            setupForm() {
                const form = document.getElementById('serviceForm');
                if (form) {
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        this.handleOrderSubmission(form);
                    });
                }
            }

            async handleOrderSubmission(form) {
                const submitBtn = document.getElementById('submitBtn');
                const originalText = submitBtn.innerHTML;

                try {
                    // تعطيل الزر وإظهار حالة التحميل
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري إرسال طلبك...';

                    // محاكاة تأخير الشبكة
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    const formData = new FormData(form);
                    const orderData = {
                        name: this.sanitizeInput(formData.get('name')),
                        email: this.sanitizeInput(formData.get('email')),
                        service: formData.get('service'),
                        message: this.sanitizeInput(formData.get('message')),
                        date: new Date().toLocaleString('ar-SA'),
                        status: 'جديد',
                        orderId: 'ORD' + Date.now()
                    };

                    // التحقق من صحة البيانات
                    if (!this.validateOrder(orderData)) {
                        throw new Error('الرجاء ملء جميع الحقول بشكل صحيح');
                    }

                    // حفظ الطلب
                    this.saveOrder(orderData);

                    // إظهار رسالة النجاح
                    this.showSuccessMessage(orderData);

                    // إعادة تعيين النموذج
                    form.reset();

                } catch (error) {
                    this.showErrorMessage(error.message);
                } finally {
                    // إعادة تعيين الزر
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            }

            validateOrder(order) {
                return order.name && order.email && order.service && order.message &&
                       order.name.length >= 3 && order.message.length >= 10;
            }

            sanitizeInput(input) {
                const div = document.createElement('div');
                div.textContent = input;
                return div.innerHTML;
            }

            saveOrder(order) {
                this.orders.unshift(order);
                localStorage.setItem('serviceOrders', JSON.stringify(this.orders));
            }

            showSuccessMessage(order) {
                const successHTML = `
                    <div style="
                        background: var(--success);
                        color: white;
                        padding: 2rem;
                        border-radius: var(--border-radius);
                        margin: 2rem 0;
                        text-align: center;
                        animation: slideUp 0.5s ease;
                        box-shadow: var(--shadow);
                    ">
                        <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                        <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">تم إرسال طلبك بنجاح! 🎉</h3>
                        <p style="margin-bottom: 0.5rem;">شكراً <strong>${order.name}</strong>، سنتواصل معك خلال 24 ساعة</p>
                        <p style="margin-bottom: 1rem;">على بريدك: <strong>${order.email}</strong></p>
                        <p><strong>رقم الطلب: ${order.orderId}</strong></p>
                    </div>
                `;

                const form = document.getElementById('serviceForm');
                form.insertAdjacentHTML('beforebegin', successHTML);

                // إزالة الرسالة بعد 8 ثوان
                setTimeout(() => {
                    const successMessage = document.querySelector('[style*="background: var(--success)"]');
                    if (successMessage) {
                        successMessage.remove();
                    }
                }, 8000);
            }

            showErrorMessage(message) {
                const errorHTML = `
                    <div style="
                        background: var(--danger);
                        color: white;
                        padding: 1.5rem;
                        border-radius: var(--border-radius);
                        margin: 1rem 0;
                        text-align: center;
                        animation: slideUp 0.5s ease;
                    ">
                        <i class="fas fa-exclamation-triangle"></i>
                        ${message}
                    </div>
                `;

                const form = document.getElementById('serviceForm');
                const existingError = form.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
                
                form.insertAdjacentHTML('afterbegin', errorHTML);
            }

            setupSmoothScroll() {
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();
                        const target = document.querySelector(this.getAttribute('href'));
                        if (target) {
                            target.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    });
                });
            }

            setupAnimations() {
                const observerOptions = {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                };

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.animation = 'slideUp 0.8s ease forwards';
                            entry.target.style.opacity = '1';
                        }
                    });
                }, observerOptions);

                document.querySelectorAll('.feature-card, .portfolio-item, .pricing-card').forEach(el => {
                    el.style.opacity = '0';
                    observer.observe(el);
                });
            }
        }

        // دوال مساعدة للطلب
        function setService(serviceType) {
            document.getElementById('service').value = serviceType;
        }

        function orderService(serviceName, serviceType) {
            setService(serviceType);
            document.getElementById('contact').scrollIntoView({ 
                behavior: 'smooth' 
            });
            
            // عرض رسالة تأكيد
            setTimeout(() => {
                alert(`🎯 جاهز لبدء مشروع ${serviceName} الخاص بك! فقط أكمل البيانات وسأتواصل معك خلال ساعات.`);
            }, 500);
        }

        function showServiceDetails(serviceName) {
            const details = {
                'متجر إلكتروني': '• سلة تسوق متكاملة\n• نظام دفع آمن\n• إدارة منتجات\n• تقارير مبيعات\n• لوحة تحكم',
                'موقع شركة': '• صفحات متعددة\n• نظام مدونة\n• نماذج اتصال\n• معرض أعمال\n• إدارة محتوى',
                'صفحة هبوط': '• تصميم مخصص\n• تحسين التحويلات\n• تكامل وسائل التواصل\n• تحليلات أداء',
                'موقع شخصي': '• بورتفوليو تفاعلي\n• سيرة ذاتية\n• معرض مشاريع\n• مدونة شخصية'
            };
            
            alert(`📋 تفاصيل خدمة ${serviceName}:\n\n${details[serviceName] || 'خدمة مخصصة حسب متطلباتك'}`);
        }

        // تأثير التمرير على الهيدر
        window.addEventListener('scroll', function() {
            const header = document.querySelector('header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 5px 40px rgba(0,0,0,0.15)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            }
        });

        // تهيئة النظام عند تحميل الصفحة
        document.addEventListener('DOMContentLoaded', function() {
            window.serviceManager = new ServiceManager();
            
            // منع حقن الأكواد
            document.querySelectorAll('input, textarea').forEach(field => {
                field.addEventListener('input', function(e) {
                    this.value = this.value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                });
            });
        });

        // التعامل مع الأخطاء
        window.addEventListener('error', function(e) {
            console.error('حدث خطأ:', e.error);
        });