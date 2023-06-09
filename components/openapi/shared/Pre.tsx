import cn from 'clsx';

import type { ComponentProps, ReactElement, RefObject } from 'react';

import { useRef, useState } from 'react';

interface PreProps extends ComponentProps<'pre'> {
  filename?: string;
  dark?: boolean;
  method?: string;
  fromRequest?: boolean;
  requestSamples?: { languageName: string; request: string }[];
}

const Pre = ({
  children,
  className,
  filename,
  dark,
  method,
  fromRequest,
  requestSamples,
  ...props
}: PreProps): ReactElement => {
  const preRef: RefObject<HTMLPreElement> = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const getFilenameSection = () => {
    if (!filename) {
      return null;
    }

    return (
      <div
        className={cn(
          dark ? 'text-white' : 'nx-text-gray-700 dark:nx-text-gray-200',
          'nx-absolute nx-top-0 nx-z-[1] nx-w-full nx-truncate nx-rounded-t-xl nx-bg-primary-700/5 nx-py-2 nx-px-4 nx-text-xs dark:nx-bg-primary-300/10 flex flex-row justify-between',
        )}
      >
        <div>
          {method && (
            <span className="uppercase mr-3 text-green-600">{method}</span>
          )}
          {filename}
        </div>
        {renderLanguageSelector()}
      </div>
    );
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  const renderLanguageSelector = () => {
    if (!fromRequest || !requestSamples) {
      return null;
    }

    return (
      <div className="nx-ml-4">
        <select
          id="languageSelect"
          value={selectedLanguage}
          className="bg-transparent focus:outline-none"
          onChange={(e) => handleLanguageChange(e.target.value)}
        >
          {requestSamples.map((sample, index) => (
            <option
              key={sample.languageName}
              value={sample.languageName}
              selected={index === 0}
            >
              {sample.languageName}
            </option>
          ))}
        </select>
      </div>
    );
  };
  const renderContent = () => {
    if (!selectedLanguage && requestSamples && requestSamples.length > 0) {
      setSelectedLanguage(requestSamples[0]?.languageName ?? '');
      return requestSamples[0]?.languageName ?? '';
    }

    if (selectedLanguage && requestSamples) {
      const selectedSample = requestSamples.find(
        (sample) => sample.languageName === selectedLanguage,
      );

      if (selectedSample) {
        return selectedSample.request;
      }
    }

    return children;
  };

  return (
    <div className="nextra-code-block nx-relative nx-mt-6 first:nx-mt-0">
      {getFilenameSection()}
      <pre
        className={cn(
          'nx-mb-4 nx-overflow-x-auto nx-rounded-xl nx-font-medium nx-subpixel-antialiased dark:nx-bg-primary-300/10 nx-text-[.9em]',
          'contrast-more:nx-border contrast-more:nx-border-primary-900/20 contrast-more:nx-contrast-150 contrast-more:dark:nx-border-primary-100/40',
          filename ? 'nx-pt-12 nx-pb-4' : 'nx-py-4',
          dark ? 'bg-slate-800 text-gray-300' : 'nx-bg-primary-700/5',
          className,
        )}
        ref={preRef}
        {...props}
      >
        {renderContent()}
      </pre>
      <div
        className={cn(
          'nx-opacity-0 nx-transition [div:hover>&]:nx-opacity-100 focus-within:nx-opacity-100',
          'nx-flex nx-gap-1 nx-absolute nx-m-[11px] nx-right-0',
          filename ? 'nx-top-8' : 'nx-top-0',
        )}
      ></div>
    </div>
  );
};

export default Pre;
