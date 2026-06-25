import { View } from "react-native";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { AppText } from "@/components/AppText";
import { colors } from "@/theme/colors";

function Section({ title, body }: { title: string; body: string }) {
  return (
    <View style={{ marginTop: 20 }}>
      <AppText weight="bold" style={{ fontSize: 16, color: colors.ink, marginBottom: 8 }}>
        {title}
      </AppText>
      <AppText style={{ fontSize: 14, color: colors.ink, lineHeight: 26 }}>{body}</AppText>
    </View>
  );
}

export default function PrivacyScreen() {
  return (
    <Screen>
      <ScreenHeader title="الخصوصية والشروط" icon="shield-checkmark" />

      <AppText style={{ fontSize: 13, color: colors.muted, lineHeight: 24 }}>
        آخر تحديث: ٢٠٢٦ — تطبيق "فل كير" يحترم خصوصيتكِ ويوضّح هنا كيفية تعامله مع بياناتكِ
        وشروط استخدامه.
      </AppText>

      {/* سياسة الخصوصية */}
      <AppText weight="bold" style={{ fontSize: 19, color: colors.primaryDark, marginTop: 24 }}>
        سياسة الخصوصية
      </AppText>

      <Section
        title="البيانات التي نجمعها"
        body="عند إنشاء حساب نحفظ بريدكِ الإلكتروني واسمكِ المختار فقط. كما نحفظ تقدّمكِ (المهام المكتملة، النقاط، الشارات، وإعدادات الحَبْسَة) لمزامنتها بين أجهزتكِ. لا نطلب أي بيانات حسّاسة."
      />
      <Section
        title="أين تُحفظ بياناتكِ"
        body="تُحفظ بياناتكِ على جهازكِ محلياً، وعند تسجيل الدخول تُزامَن بشكل آمن مع خوادم Supabase. كل مستخدمة ترى بياناتها فقط ولا يمكن لأحد غيركِ الوصول إليها."
      />
      <Section
        title="كيف نستخدم البيانات"
        body="نستخدم بياناتكِ فقط لتشغيل التطبيق وحفظ تقدّمكِ وتحسين تجربتكِ. لا نبيع بياناتكِ ولا نشاركها مع أطراف خارجية لأغراض تسويقية."
      />
      <Section
        title="حذف الحساب"
        body="يمكنكِ طلب حذف حسابكِ وكل بياناتكِ في أي وقت عبر التواصل معنا، وسننفّذ ذلك خلال مدة معقولة."
      />

      {/* شروط الاستخدام */}
      <AppText weight="bold" style={{ fontSize: 19, color: colors.primaryDark, marginTop: 28 }}>
        شروط الاستخدام
      </AppText>

      <Section
        title="طبيعة المحتوى"
        body="فل كير تطبيق عناية وجمال يقدّم إرشادات ومبادئ عامة للعناية اليومية مستوحاة من التراث السوداني والممارسات الحديثة. المحتوى للأغراض التثقيفية والجمالية فقط — هو عناية لا علاج."
      />
      <Section
        title="ليس بديلاً عن الطبيب"
        body="لا يقدّم التطبيق نصائح طبية أو تشخيصاً أو علاجاً. عند وجود أي حالة صحية أو حساسية أو حمل أو رضاعة، استشيري مختصاً قبل تطبيق أي ممارسة. توقّفي فوراً عند أي تهيّج أو انزعاج."
      />
      <Section
        title="المسؤولية"
        body="تستخدمين المحتوى على مسؤوليتكِ الشخصية. الأسماء التجارية التي قد تُذكر هي أمثلة توضيحية فقط بلا تبنٍّ أو ترويج."
      />
      <Section
        title="الباقات المدفوعة"
        body="بعض المحتوى (مثل باقة حَبْسَة العروس) قد يكون مدفوعاً. تُوضَّح تفاصيل الاشتراك وسعره قبل الدفع."
      />

      <View
        style={{
          marginTop: 28,
          backgroundColor: "#FEF6E7",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <AppText style={{ fontSize: 13, color: colors.ink, lineHeight: 24, textAlign: "center" }}>
          باستخدامكِ للتطبيق فإنكِ توافقين على سياسة الخصوصية وشروط الاستخدام أعلاه.
        </AppText>
      </View>
    </Screen>
  );
}
