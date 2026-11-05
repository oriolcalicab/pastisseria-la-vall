import FormField from '../../../components/FormField'
import type { ShippingAddress, ShippingAddressErrors } from '../types/checkout'

type AddressFormProps = {
  values: ShippingAddress
  errors: ShippingAddressErrors
  onChange: (field: keyof ShippingAddress, value: string) => void
}

const AddressForm = ({ values, errors, onChange }: AddressFormProps) => (
  <fieldset className="space-y-4">
    <legend className="font-medium">Adreça de lliurament</legend>
    <FormField
      id="address"
      label="Adreça"
      type="text"
      autoComplete="street-address"
      value={values.address}
      error={errors.address}
      onChange={(value) => onChange('address', value)}
    />
    <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
      <FormField
        id="city"
        label="Població"
        type="text"
        autoComplete="address-level2"
        value={values.city}
        error={errors.city}
        onChange={(value) => onChange('city', value)}
      />
      <FormField
        id="postalCode"
        label="Codi postal"
        type="text"
        inputMode="numeric"
        autoComplete="postal-code"
        value={values.postalCode}
        error={errors.postalCode}
        onChange={(value) => onChange('postalCode', value)}
      />
    </div>
  </fieldset>
)

export default AddressForm