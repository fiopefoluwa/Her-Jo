#!/usr/bin/env node
/**
 * Batch-convert shadcn/ui .tsx components to .jsx
 * Strips TypeScript type annotations while preserving functionality
 */
import fs from 'fs';
import path from 'path';

const SRC_DIR = '/Users/fiopefoluwaorekoya/Downloads/Culturally Grounded Fintech Design/src/app/components/ui';
const DEST_DIR = '/Users/fiopefoluwaorekoya/Downloads/Culturally Grounded Fintech Design/frontend/src/components/ui';

// Skip files we already manually converted
const SKIP = new Set(['button.tsx', 'card.tsx', 'progress.tsx', 'utils.ts']);

// Files to convert
const files = fs.readdirSync(SRC_DIR).filter(f => 
  (f.endsWith('.tsx') || f.endsWith('.ts')) && !SKIP.has(f)
);

function stripTypes(content) {
  // Replace import path for utils
  content = content.replace(/from\s+["']\.\/utils["']/g, 'from "@/lib/utils"');
  
  // Remove TypeScript-specific type imports
  content = content.replace(/,\s*type\s+\w+/g, '');
  content = content.replace(/import\s+type\s+.*?;\n/g, '');
  
  // Remove type annotations from function params
  content = content.replace(/:\s*React\.ComponentProps<[^>]+>/g, '');
  content = content.replace(/:\s*React\.ComponentPropsWithoutRef<[^>]+>/g, '');
  content = content.replace(/:\s*React\.HTMLAttributes<[^>]+>/g, '');
  content = content.replace(/:\s*React\.ThHTMLAttributes<[^>]+>/g, '');
  content = content.replace(/:\s*React\.TdHTMLAttributes<[^>]+>/g, '');
  content = content.replace(/:\s*React\.ElementRef<[^>]+>/g, '');
  content = content.replace(/:\s*VariantProps<typeof\s+\w+>/g, '');
  
  // Remove generic type params from React.forwardRef<Type, Props>
  content = content.replace(/React\.forwardRef<[^>]+>/g, 'React.forwardRef');
  
  // Remove interface/type declarations (single line)
  content = content.replace(/^(export\s+)?type\s+\w+\s*=\s*[^;]+;\n*/gm, '');
  
  return content;
}

// Ensure dest dir exists
fs.mkdirSync(DEST_DIR, { recursive: true });

let converted = 0;
for (const file of files) {
  const srcPath = path.join(SRC_DIR, file);
  const content = fs.readFileSync(srcPath, 'utf-8');
  const newContent = stripTypes(content);
  
  const newFileName = file.replace(/\.tsx$/, '.jsx').replace(/\.ts$/, '.js');
  const destPath = path.join(DEST_DIR, newFileName);
  
  // Don't overwrite manually created files
  if (!fs.existsSync(destPath)) {
    fs.writeFileSync(destPath, newContent);
    converted++;
    console.log(`✓ ${file} → ${newFileName}`);
  } else {
    console.log(`⊘ ${newFileName} already exists, skipping`);
  }
}

console.log(`\nConverted ${converted} files.`);
