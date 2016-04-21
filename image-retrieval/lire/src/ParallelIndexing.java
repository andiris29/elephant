import net.semanticmetadata.lire.aggregators.AbstractAggregator;
import net.semanticmetadata.lire.aggregators.BOVW;
import net.semanticmetadata.lire.builders.DocumentBuilder;
import net.semanticmetadata.lire.imageanalysis.features.global.AutoColorCorrelogram;
import net.semanticmetadata.lire.imageanalysis.features.global.CEDD;
import net.semanticmetadata.lire.imageanalysis.features.global.FCTH;
import net.semanticmetadata.lire.imageanalysis.features.global.JCD;
import net.semanticmetadata.lire.imageanalysis.features.local.opencvfeatures.CvSiftExtractor;
import net.semanticmetadata.lire.imageanalysis.features.local.opencvfeatures.CvSurfExtractor;
import net.semanticmetadata.lire.imageanalysis.features.local.simple.SimpleExtractor;
import net.semanticmetadata.lire.indexers.parallel.ParallelIndexer;

import java.io.File;
import java.io.IOException;

/**
 * Simple class showing the use of the ParallelIndexer, which uses up as much CPU as it can get.
 * @author Mathias Lux, mathias@juggle.at and Nektarios Anagnostopoulos, nek.anag@gmail.com
 */
public class ParallelIndexing {
    public static void main(String[] args) throws IOException {
        args = new String[1];
        args[0] = "/Users/i068020/Documents/_git/ant/elephant/image-retrieval/images/db";
        // Checking if arg[0] is there and if it is a directory.
        boolean passed = false;
        if (args.length > 0) {
            File f = new File(args[0]);
            System.out.println("Indexing images in " + args[0]);
            if (f.exists() && f.isDirectory()) passed = true;
        }
        if (!passed) {
            System.out.println("No directory given as first argument.");
            System.out.println("Run \"ParallelIndexing <directory>\" to index files of a directory.");
            System.exit(1);
        }

        // use ParallelIndexer to index all photos from args[0] into "index".
        int numOfDocsForVocabulary = 500;
        Class<? extends AbstractAggregator> aggregator = BOVW.class;
        int[] numOfClusters = new int[] {128, 512};

        ParallelIndexer indexer = new ParallelIndexer(DocumentBuilder.NUM_OF_THREADS, "index", args[0], numOfClusters, numOfDocsForVocabulary, aggregator);
        //Global
        indexer.addExtractor(CEDD.class);
        indexer.addExtractor(FCTH.class);
        indexer.addExtractor(AutoColorCorrelogram.class);
        //Local
        indexer.addExtractor(CvSurfExtractor.class);
        indexer.addExtractor(CvSiftExtractor.class);
        //Simple
        indexer.addExtractor(CEDD.class, SimpleExtractor.KeypointDetector.CVSURF);
        indexer.addExtractor(JCD.class, SimpleExtractor.KeypointDetector.Random);

        indexer.run();
        System.out.println("Finished indexing.");
    }
}