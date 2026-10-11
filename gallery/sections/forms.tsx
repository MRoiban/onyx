import { useState, useEffect } from 'react';
import {
  Field,
  Label,
  FieldDescription,
  FieldError,
  Fieldset,
  Legend,
} from '../../src/field';
import { Input } from '../../src/input';
import { Textarea } from '../../src/textarea';
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupSeparator,
  InputGroupButton,
} from '../../src/input-group';
import { SearchField } from '../../src/search-field';
import { NumberField } from '../../src/number-field';
import { Slider } from '../../src/slider';
import { RadioGroup, RadioGroupItem } from '../../src/radio-group';
import {
  CheckboxGroup,
  CheckboxGroupSelectAll,
} from '../../src/checkbox-group';
import { OTPField } from '../../src/otp-field';
import { PasswordField } from '../../src/password-field';
import { Toggle } from '../../src/toggle';
import { ToggleGroup, ToggleGroupItem } from '../../src/toggle-group';
import { ColorSwatch, ColorSwatchGroup } from '../../src/color-swatch';
import { ColorPicker } from '../../src/color-picker';
import { type CalendarValue } from '../../src/calendar';
import { DatePicker } from '../../src/date-picker';
import { DropZone } from '../../src/drop-zone';
import { FileTrigger } from '../../src/file-trigger';
import { Icon } from '../../src/icon';
const gap12 = { gap: 'var(--onyx-space-3)' };
function FindToggles() {
  return (
    <>
      <Toggle defaultPressed aria-label="Match case">
        Aa
      </Toggle>
      <Toggle aria-label="Match whole word">
        <span style={{ textDecoration: 'underline' }}>ab</span>
      </Toggle>
      <Toggle defaultPressed aria-label="Regular expression">
        .*
      </Toggle>
    </>
  );
}
export default function Forms() {
  useEffect(() => {
    if (location.hash !== '#forms') return;
    const frame = requestAnimationFrame(() => {
      const section = document.getElementById('forms');
      const header = document.querySelector('.g-bar');
      if (section)
        window.scrollTo(
          0,
          window.scrollY +
            section.getBoundingClientRect().top -
            (header?.getBoundingClientRect().height ?? 0) -
            12,
        );
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  const [scale, setScale] = useState([110]);
  const [price, setPrice] = useState([20, 65]);
  const [notes, setNotes] = useState('Keep dialogue tone informal.');
  const [range, setRange] = useState<CalendarValue>({
    from: new Date(2026, 9, 6),
    to: new Date(2026, 9, 10),
  });
  const [files, setFiles] = useState<File[]>([]);
  const [locales, setLocales] = useState(['en', 'fr']);
  return (
    <section className="g-sec" id="forms">
      <h2>4 · Forms</h2>
      <div className="g-grid">
        <div className="g-cell">
          <h3>
            Field <code>label · description · error</code>
          </h3>
          <div className="col" style={gap12}>
            <Field required>
              <Label>Workspace name</Label>
              <Input placeholder="my-workspace" />
              <FieldDescription>
                Letters, numbers, hyphens or underscores.
              </FieldDescription>
            </Field>
            <Field invalid>
              <Label optional>Server address</Label>
              <Input defaultValue="bedrock.local:80a" />
              <FieldError>Port must be a number.</FieldError>
            </Field>
            <Field disabled>
              <Label>Region</Label>
              <Input defaultValue="eu-west (locked)" />
            </Field>
          </div>
        </div>
        <div className="g-cell">
          <h3>
            InputGroup · SearchField <code>addons · inline toggles</code>
          </h3>
          <div
            className="col"
            style={{ gap: 'calc(var(--onyx-space-2) + var(--onyx-space-0-5))' }}
          >
            <SearchField
              aria-label="Find"
              defaultValue="sunberry"
              toggles={<FindToggles />}
              clearable={false}
            />
            <Field invalid>
              <SearchField
                aria-label="Regular expression"
                defaultValue="(unclosed"
                clearable={false}
                toggles={
                  <Toggle defaultPressed aria-label="Regular expression">
                    .*
                  </Toggle>
                }
              />
              <FieldError>Invalid regular expression.</FieldError>
            </Field>
            <InputGroup>
              <InputGroupAddon>https://</InputGroupAddon>
              <InputGroupSeparator />
              <InputGroupInput aria-label="Subdomain" defaultValue="notes" />
              <InputGroupAddon>.bedrock.dev</InputGroupAddon>
            </InputGroup>
            <InputGroup leading={<Icon name="filter" size="sm" />}>
              <InputGroupInput
                aria-label="Filter files"
                defaultValue="fr.json"
                id="forms-filter"
              />
              <InputGroupButton
                aria-label="Clear filter"
                onClick={() => {
                  const el = document.getElementById(
                    'forms-filter',
                  ) as HTMLInputElement;
                  el.value = '';
                  el.focus();
                }}
              >
                <Icon name="close" size="sm" />
              </InputGroupButton>
            </InputGroup>
          </div>
        </div>
        <div className="g-cell">
          <h3>NumberField · Slider</h3>
          <div
            className="col"
            style={{ gap: 'calc(var(--onyx-space-3) + var(--onyx-space-0-5))' }}
          >
            <Field>
              <Label>Font size</Label>
              <NumberField defaultValue={13} min={8} max={72} unit="px" />
            </Field>
            <Field>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <Label>UI scale</Label>
                <span>{scale[0]}%</span>
              </div>
              <Slider
                aria-label="UI scale"
                min={80}
                max={140}
                value={scale}
                onValueChange={setScale}
                marks={[80, 100, 120, 140]}
                formatValue={(n) => `${n}%`}
              />
            </Field>
            <Field>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <Label>Price range</Label>
                <span>
                  €{price[0]} – €{price[1]}
                </span>
              </div>
              <Slider
                aria-label="Price range"
                value={price}
                onValueChange={setPrice}
              />
            </Field>
          </div>
        </div>
        <div className="g-cell">
          <h3>
            RadioGroup · CheckboxGroup <code>fieldset</code>
          </h3>
          <div className="col" style={gap12}>
            <Fieldset>
              <Legend>Sync</Legend>
              <RadioGroup aria-label="Sync" defaultValue="live" name="sync">
                <RadioGroupItem value="live">
                  <span>Live</span>
                  <FieldDescription>
                    Push changes to every client immediately.
                  </FieldDescription>
                </RadioGroupItem>
                <RadioGroupItem value="manual">
                  <span>Manual</span>
                  <FieldDescription>Publish when you choose.</FieldDescription>
                </RadioGroupItem>
              </RadioGroup>
            </Fieldset>
            <RadioGroup
              variant="card"
              defaultValue="compact"
              aria-label="Density"
            >
              <RadioGroupItem value="compact">Compact</RadioGroupItem>
              <RadioGroupItem value="comfortable">Comfortable</RadioGroupItem>
            </RadioGroup>
            <CheckboxGroup
              options={['en', 'fr', 'de', 'es', 'it']}
              value={locales}
              onValueChange={setLocales}
            >
              <label className="row">
                <CheckboxGroupSelectAll />
                All locales ({locales.length} of 5)
              </label>
            </CheckboxGroup>
          </div>
        </div>
        <div className="g-cell">
          <h3>OTP · Password · Textarea</h3>
          <div className="col" style={gap12}>
            <Field>
              <Label>Verification code</Label>
              <OTPField defaultValue="481" />
            </Field>
            <Field>
              <Label>Token</Label>
              <PasswordField defaultValue="secretsecret" />
            </Field>
            <Field>
              <Label>Notes</Label>
              <Textarea
                value={notes}
                maxLength={500}
                onChange={(e) => setNotes(e.target.value)}
              />
              <FieldDescription style={{ textAlign: 'right' }}>
                {notes.length} / 500
              </FieldDescription>
            </Field>
          </div>
        </div>
        <div className="g-cell">
          <h3>ColorSwatch · ColorPicker</h3>
          <div className="col" style={gap12}>
            <ColorSwatchGroup defaultValue="#4385BE" aria-label="Accent color">
              {[
                '#D14D41',
                '#DA702C',
                '#D0A215',
                '#879A39',
                '#3AA99F',
                '#4385BE',
                '#8B7EC8',
                '#CE5D97',
              ].map((color) => (
                <ColorSwatch key={color} color={color} />
              ))}
            </ColorSwatchGroup>
            <ColorPicker defaultValue="#205EA6" />
          </div>
        </div>
        <div className="g-cell">
          <h3>
            DatePicker · Calendar <code>range</code>
          </h3>
          <div
            className="stage"
            style={{ minHeight: 'calc(var(--onyx-space-10) * 7.5)' }}
          >
            <DatePicker
              mode="range"
              label="Release window"
              value={range}
              onValueChange={setRange}
              defaultMonth={new Date(2026, 9, 1)}
              locale="en-GB"
              defaultOpen
              contentProps={{ onOpenAutoFocus: (event) => event.preventDefault() }}
            />
          </div>
        </div>
        <div className="g-cell">
          <h3>
            FileTrigger · DropZone <code>idle · over · invalid</code>
          </h3>
          <div className="col">
            <DropZone
              accept=".zip,.json"
              maxSize={50 * 1024 * 1024}
              onFiles={setFiles}
              aria-label="Upload files"
            >
              <Icon name="cloud-upload" />
              <span>
                {files.length ? (
                  `${files.length} files ready`
                ) : (
                  <>
                    Drop files here or{' '}
                    <span style={{ color: 'var(--onyx-text-link)' }}>
                      browse
                    </span>
                  </>
                )}
              </span>
              <FieldDescription>.zip, .json up to 50 MB</FieldDescription>
            </DropZone>
            <div className="row" style={{ alignItems: 'stretch' }}>
              <DropZone
                accept=".zip,.json"
                onFiles={setFiles}
                data-drop-target=""
                aria-label="Drop target"
                style={{
                  flex: 1,
                  padding: 'calc(var(--onyx-space-2) + var(--onyx-space-0-5))',
                }}
              >
                <span>
                  <Icon name="arrow-down" size="sm" /> Release to add 3 files
                </span>
              </DropZone>
              <DropZone
                accept=".zip,.json"
                invalid
                onFiles={setFiles}
                aria-label="Invalid drop"
                style={{
                  flex: 1,
                  padding: 'calc(var(--onyx-space-2) + var(--onyx-space-0-5))',
                }}
              >
                <span style={{ color: 'var(--onyx-tone-danger-fg)' }}>
                  .exe not allowed
                </span>
              </DropZone>
            </div>
            <FileTrigger
              variant="secondary"
              size="sm"
              accept=".zip,.json"
              multiple
              onFiles={setFiles}
              style={{ width: 'fit-content' }}
            >
              <Icon name="file-add" size="sm" />
              Choose files…
            </FileTrigger>
          </div>
        </div>
      </div>
    </section>
  );
}
export function FormsActions() {
  return (
    <div className="g-cell">
      <h3>
        Toggle · ToggleGroup <code>aria-pressed</code>
      </h3>
      <div className="col">
        <div className="row">
          <Toggle defaultPressed aria-label="Match case">
            Aa
          </Toggle>
          <Toggle aria-label="Match whole word">
            <span style={{ textDecoration: 'underline' }}>ab</span>
          </Toggle>
          <Toggle defaultPressed aria-label="Regular expression">
            .*
          </Toggle>
          <Toggle aria-label="Preserve case">
            <Icon name="preserve-case" size="sm" />
          </Toggle>
        </div>
        <ToggleGroup type="single" defaultValue="list" aria-label="View">
          <ToggleGroupItem value="list">
            <Icon name="list-flat" size="sm" />
            &nbsp;List
          </ToggleGroupItem>
          <ToggleGroupItem value="tree">
            <Icon name="list-tree" size="sm" />
            &nbsp;Tree
          </ToggleGroupItem>
          <ToggleGroupItem value="table">
            <Icon name="table" size="sm" />
            &nbsp;Table
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
