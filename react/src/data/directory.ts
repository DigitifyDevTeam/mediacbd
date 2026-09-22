import type { DirectoryBusiness } from '../types/content'
import directoryData from './directory.json'

/** Curated partner listings — public annuaire (paid / verified). Regenerated selectively; GMB CSV stays offline for sales. */
export const directoryBusinesses = directoryData as DirectoryBusiness[]
