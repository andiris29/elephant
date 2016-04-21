import net.semanticmetadata.lire.DocumentBuilder;
import net.semanticmetadata.lire.ImageSearchHits;
import net.semanticmetadata.lire.imageanalysis.GenericDoubleLireFeature;
import net.semanticmetadata.lire.imageanalysis.SurfFeature;
import net.semanticmetadata.lire.imageanalysis.bovw.BOVWBuilder;
import net.semanticmetadata.lire.imageanalysis.opencvfeatures.CvSurfFeature;
import net.semanticmetadata.lire.impl.ChainedDocumentBuilder;
import net.semanticmetadata.lire.impl.CvSurfDocumentBuilder;
import net.semanticmetadata.lire.impl.GenericFastImageSearcher;
import net.semanticmetadata.lire.impl.SurfDocumentBuilder;
import net.semanticmetadata.lire.indexing.parallel.ParallelIndexer;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.store.IOContext;
import org.apache.lucene.store.RAMDirectory;

import javax.imageio.ImageIO;
import java.io.File;
import java.io.IOException;

/**
 * Created by I068020 on 4/21/2016.
 */
public class VisualWordsImageSearcherSample {
    public static void main(String[] args) throws IOException {
        String queryImage = "C:/_git/ant/elephant/image-retrieval/images/search/db20-xx.jpg";
        String datasetPath = "C:/_git/ant/elephant/image-retrieval/images/db";
        String indexPath = "C:/_git/ant/elephant/image-retrieval/lire-0.9.5/index";

        ParallelIndexer parallelIndexer = new ParallelIndexer(16, indexPath, datasetPath, true) {
            @Override
            public void addBuilders(ChainedDocumentBuilder builder) {
                builder.addBuilder(new SurfDocumentBuilder());
                builder.addBuilder(new CvSurfDocumentBuilder());
            }
        };
        parallelIndexer.run();

        System.out.println("** SURF BoVW");
        BOVWBuilder bovwBuilderSURF = new BOVWBuilder(DirectoryReader.open(FSDirectory.open(new File(indexPath))), new SurfFeature(), 500, 512);
        bovwBuilderSURF.index();
        System.out.println("** CVSURF BoVW");
        BOVWBuilder bovwBuilderCVSURF = new BOVWBuilder(DirectoryReader.open(FSDirectory.open(new File(indexPath))), new CvSurfFeature(), 500, 512);
        bovwBuilderCVSURF.index();

        IndexReader reader = DirectoryReader.open(new RAMDirectory(FSDirectory.open(new File(indexPath)), IOContext.READONCE));

        GenericFastImageSearcher gfisSURF = new GenericFastImageSearcher(5, GenericDoubleLireFeature.class, DocumentBuilder.FIELD_NAME_SURF + DocumentBuilder.FIELD_NAME_BOVW_VECTOR, true, reader);
        GenericFastImageSearcher gfisCVSURF = new GenericFastImageSearcher(5, GenericDoubleLireFeature.class, DocumentBuilder.FIELD_NAME_CVSURF + DocumentBuilder.FIELD_NAME_BOVW_VECTOR, true, reader);

        SurfDocumentBuilder SurfBuilder = new SurfDocumentBuilder();
        CvSurfDocumentBuilder cvSurfBuilder = new CvSurfDocumentBuilder();
        Document docSURF = bovwBuilderSURF.getVisualWords(SurfBuilder.createDocument(ImageIO.read(new File(queryImage)), queryImage));
        Document docCVSURF = bovwBuilderCVSURF.getVisualWords(cvSurfBuilder.createDocument(ImageIO.read(new File(queryImage)), queryImage));

        ImageSearchHits hitsSURF = gfisSURF.search(docSURF, reader);
        ImageSearchHits hitsCVSURF = gfisCVSURF.search(docCVSURF, reader);

        System.out.println("SURF results:");
        for(int i= 0; i < hitsSURF.length(); i++){
            String fileName = hitsSURF.doc(i).getField(DocumentBuilder.FIELD_NAME_IDENTIFIER).stringValue();
            System.out.println(i + ": " + hitsSURF.score(i) + " ~ " + fileName);
        }
        System.out.println();
        System.out.println("CVSURF results:");
        for(int i= 0; i < hitsCVSURF.length(); i++){
            String fileName = hitsCVSURF.doc(i).getField(DocumentBuilder.FIELD_NAME_IDENTIFIER).stringValue();
            System.out.println(i + ": " + hitsCVSURF.score(i) + " ~ " + fileName);
        }
    }
}
