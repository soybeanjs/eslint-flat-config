import process from 'node:process';
import { isPackageExists } from 'local-pkg';
import type { Awaitable } from '../types';

export async function interopDefault<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m;
  return (resolved as any).default || resolved;
}

export async function ensurePackages(packages: string[]) {
  if (process.env.CI || process.stdout.isTTY === false) return;

  const nonExistingPackages = packages.filter(i => !isPackageExists(i));
  if (nonExistingPackages.length === 0) return;

  const { default: prompts } = await import('prompts');

  const message = `${
    nonExistingPackages.length === 1 ? 'Package is' : 'Packages are'
  } required for this config: ${nonExistingPackages.join(', ')}. Do you want to install them?`;

  const { result } = await prompts([
    {
      message,
      name: 'result',
      type: 'confirm'
    }
  ]);

  if (result) {
    const { installPackage } = await import('@antfu/install-pkg');
    await installPackage(nonExistingPackages, { dev: true });
  }
}
