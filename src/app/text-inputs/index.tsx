import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';

import { KeyboardAwareScrollView, ThemedInputText, ThemedInputTextV2 } from '@/components';
import { useResolvedColor } from '@/hooks';

export default function TextInputsScreen() {
  const textColor = useResolvedColor('text');
  const backgroundColor = useResolvedColor('background');

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [price, setPrice] = useState('');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rfc, setRfc] = useState('');
  const [v2Text, setV2Text] = useState('');
  const [v2Note, setV2Note] = useState('');
  const [v2Search, setV2Search] = useState('');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor }}
      // iOS: el teclado flota sobre la app (la ventana NO se redimensiona),
      // así que el KAV agrega el padding que ocupa el teclado.
      // Android: la ventana ya se redimensiona (softwareKeyboardLayoutMode: "resize"
      // en app.json), por eso NO aplicamos behavior para no recortar dos veces.
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      // El header del Stack no se superpone al contenido, así que no hay offset.
      keyboardVerticalOffset={0}
    >
      {/* KeyboardAwareScrollView es un ScrollView que además sabe medir el input
          enfocado y hacer scroll para que el teclado no lo tape. */}
      <KeyboardAwareScrollView
        contentContainerStyle={{ gap: 20, padding: 24, paddingBottom: 48 }}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 8 }}>
          <Text style={{ color: textColor, fontSize: 24, fontWeight: '700' }}>Text Inputs</Text>
          <Text style={{ color: textColor, opacity: 0.7, fontSize: 14 }}>
            ThemedInputText filtra el contenido según el tipo de dato que quieres capturar.
          </Text>
        </View>

        {/* Texto libre */}
        <View style={{ gap: 12 }}>
          <Text style={{ color: textColor, fontSize: 18, fontWeight: '600' }}>Texto</Text>

          <ThemedInputText
            label="Nombre"
            placeholder="Escribe tu nombre"
            value={name}
            onChangeText={setName}
            helperText="Campo de texto libre"
          />

          <ThemedInputText
            label="Descripción"
            placeholder="Multilínea"
            multiline
            numberOfLines={3}
            maxLength={200}
            showCounter
          />

          <ThemedInputText
            label="Deshabilitado"
            value="Read only"
            onChangeText={() => undefined}
            editable={false}
          />
        </View>

        {/* Numéricos */}
        <View style={{ gap: 12 }}>
          <Text style={{ color: textColor, fontSize: 18, fontWeight: '600' }}>Numéricos</Text>

          <ThemedInputText
            label="Edad"
            variant="numeric"
            placeholder="Solo números"
            leftIcon="calculator-outline"
            value={age}
            onChangeText={setAge}
            maxLength={3}
            showCounter
          />

          <ThemedInputText
            label="Precio"
            variant="decimal"
            placeholder="0.00"
            leftIcon="pricetag-outline"
            value={price}
            onChangeText={setPrice}
            decimalPlaces={2}
            helperText="Hasta 2 decimales"
          />

          <ThemedInputText
            label="Código"
            variant="alphanumeric"
            placeholder="ABC-123"
            leftIcon="barcode-outline"
            value={code}
            onChangeText={setCode}
            helperText="Solo letras y números"
          />
        </View>

        {/* Contacto y acceso */}
        <View style={{ gap: 12 }}>
          <Text style={{ color: textColor, fontSize: 18, fontWeight: '600' }}>
            Contacto y acceso
          </Text>

          <ThemedInputText
            label="Email"
            variant="email"
            placeholder="tu@email.com"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            leftIcon="mail-outline"
            value={email}
            onChangeText={setEmail}
            helperText="Se valida solo mientras escribes"
          />

          <ThemedInputText
            label="Teléfono"
            variant="phone"
            placeholder="+52 123 456 7890"
            autoComplete="tel"
            leftIcon="call-outline"
            value={phone}
            onChangeText={setPhone}
          />

          <ThemedInputText
            label="Contraseña"
            variant="password"
            placeholder="••••••••"
            autoComplete="password"
            leftIcon="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
            helperText="Toca el ojo para mostrarla"
          />
        </View>

        {/* Plantillas */}
        <View style={{ gap: 12 }}>
          <Text style={{ color: textColor, fontSize: 18, fontWeight: '600' }}>Plantillas</Text>
          <Text style={{ color: textColor, opacity: 0.6, fontSize: 13 }}>
            X = alfanumérico · 9 = número · A = letra · el resto son separadores.
          </Text>

          <ThemedInputText
            label="RFC"
            variant="template"
            template="XXX-XXXX-X"
            placeholder="XXX-XXXX-X"
            value={rfc}
            onChangeText={setRfc}
            forceUppercase
            helperText="La máscara se aplica mientras escribes"
          />

          <ThemedInputText
            label="Código postal"
            variant="template"
            template="99999"
            placeholder="99999"
            maxLength={5}
            showCounter
          />

          <ThemedInputText
            label="Teléfono con plantilla"
            variant="template"
            template="+## (###) ###-####"
            placeholder="+## (###) ###-####"
          />
        </View>

        {/* Errores */}
        <View style={{ gap: 12 }}>
          <Text style={{ color: textColor, fontSize: 18, fontWeight: '600' }}>Errores</Text>

          <ThemedInputText
            label="Usuario"
            placeholder="Nombre de usuario"
            value="pedro"
            onChangeText={() => undefined}
            error="Este usuario ya está en uso"
            required
          />

          <ThemedInputText
            label="Obligatorio"
            placeholder="Este campo es obligatorio"
            required
            helperText="Se marca con un asterisco"
          />
        </View>

        {/* ThemedInputTextV2: versión minimalista */}
        <View style={{ gap: 12, marginBottom: 100 }}>
          <Text style={{ color: textColor, fontSize: 18, fontWeight: '600' }}>
            ThemedInputTextV2 (minimalista)
          </Text>
          <Text style={{ color: textColor, opacity: 0.6, fontSize: 13 }}>
            Solo el TextInput nativo con los colores del tema. Hereda todas las props de{' '}
            <Text>{'<TextInput>'}</Text> de React Native.
          </Text>

          {/* 1. Con borde usando clases del tema */}
          <ThemedInputTextV2
            className="rounded-xl border border-border bg-background px-3 py-2 text-base"
            placeholder="Escribe tu nombre"
            value={v2Text}
            onChangeText={setV2Text}
          />

          {/* 2. Color de texto propio (token del tema) */}
          <ThemedInputTextV2
            color="primary"
            placeholderColor="tertiary"
            className="rounded-xl border border-border bg-background px-3 py-2 text-base"
            placeholder="Texto primary, placeholder tertiary"
            value={v2Note}
            onChangeText={setV2Note}
          />

          {/* 3. Multilínea */}
          <ThemedInputTextV2
            multiline
            numberOfLines={4}
            className="min-h-24 rounded-xl border border-border bg-background px-3 py-2 text-base"
            placeholder="Notas (multilínea)"
            value={v2Note}
            onChangeText={setV2Note}
            style={{ textAlignVertical: 'top' }}
          />

          {/* 4. Sin estilos extra: solo el color del tema */}
          <ThemedInputTextV2
            placeholder="Sin container, solo el tema"
            value={v2Search}
            onChangeText={setV2Search}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}
